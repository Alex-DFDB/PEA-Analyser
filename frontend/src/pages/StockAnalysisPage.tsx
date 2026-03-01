import { useState, useMemo } from "react";
import StockAreaChart from "../components/Charts/StockAreaChart";
import type { Position } from "../types";

/**
 * Props for the StockAnalysisPage component
 */
interface StockAnalysisPageProps {
    /** Portfolio positions */
    positions: Position[];
    /** Historical price data for each ticker */
    historicalData: { [ticker: string]: any[] };
    /** Loading state for historical data */
    historicalLoading?: boolean;
    /** Dividend state */
    dividendState?: {
        dividendData: any[];
        loading: boolean;
    };
}

/**
 * StockAnalysisPage displays detailed analysis for individual stocks
 * Includes price chart, performance metrics, and dividend information
 */
const StockAnalysisPage = ({
    positions,
    historicalData,
    historicalLoading = false,
    dividendState,
}: StockAnalysisPageProps) => {
    const [selectedTicker, setSelectedTicker] = useState<string>(
        positions.length > 0 ? positions[0].ticker : ""
    );

    // Get selected position
    const selectedPosition = positions.find((p) => p.ticker === selectedTicker);
    const selectedHistoricalData = selectedTicker ? historicalData[selectedTicker] || [] : [];

    /**
     * Calculate performance metrics for the selected stock
     */
    const metrics = useMemo(() => {
        if (!selectedPosition || selectedHistoricalData.length === 0) {
            return null;
        }

        const data = selectedHistoricalData;
        const firstPrice = data[0]?.Close || 0;
        const lastPrice = data[data.length - 1]?.Close || selectedPosition.currentPrice;
        const changePercent = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

        // Calculate 52-week high and low
        const recentData = data.slice(-252); // Approximately 1 year of trading days
        const prices = recentData.map((d) => d.Close);
        const high52Week = Math.max(...prices);
        const low52Week = Math.min(...prices);

        // Calculate average volume
        const volumes = data.slice(-30).map((d) => d.Volume); // Last 30 days
        const avgVolume = volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0;

        // Position gain/loss
        const positionGain = (selectedPosition.currentPrice - selectedPosition.buyPrice) * selectedPosition.quantity;
        const positionGainPercent =
            ((selectedPosition.currentPrice - selectedPosition.buyPrice) / selectedPosition.buyPrice) * 100;

        // Get dividend info
        const dividendInfo = dividendState?.dividendData.find(
            (d) => d.ticker === selectedPosition.ticker
        );
        const annualDividend = dividendInfo?.annual_total || 0;
        const dividendYield = selectedPosition.dividendYield || 0;

        return {
            changePercent,
            high52Week,
            low52Week,
            avgVolume,
            positionGain,
            positionGainPercent,
            annualDividend,
            dividendYield,
            totalValue: selectedPosition.currentPrice * selectedPosition.quantity,
            totalInvested: selectedPosition.buyPrice * selectedPosition.quantity,
        };
    }, [selectedPosition, selectedHistoricalData, dividendState]);

    const cardStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "14px",
        border: "1px solid var(--cream-darker)",
        padding: "20px 24px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    };

    const rowStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid var(--cream-dark)",
        fontSize: "13px",
    };

    if (positions.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                    Aucune position dans votre portefeuille.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Sélecteur d'action */}
            <div className="pea-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--ink)", margin: 0 }}>
                        Analyse par Action
                    </h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <label
                            htmlFor="stock-selector"
                            className="pea-label"
                        >
                            Action
                        </label>
                        <select
                            id="stock-selector"
                            value={selectedTicker}
                            onChange={(e) => setSelectedTicker(e.target.value)}
                            style={{
                                backgroundColor: "var(--cream-dark)",
                                border: "1px solid var(--cream-darker)",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                fontSize: "13px",
                                color: "var(--ink-soft)",
                                outline: "none",
                                minWidth: "220px",
                                cursor: "pointer",
                            }}
                        >
                            {positions.map((position) => (
                                <option key={position.ticker} value={position.ticker}>
                                    {position.name || position.ticker} ({position.ticker})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedPosition && metrics && (
                <>
                    {/* KPI Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                        {/* Prix actuel */}
                        <div className="pea-card pea-card-dots" style={{ padding: "20px 24px", position: "relative" }}>
                            <p className="pea-label" style={{ marginBottom: "8px" }}>Prix Actuel</p>
                            <div style={{ fontSize: "22px", fontWeight: 500, color: "var(--ink)" }}>
                                {selectedPosition.currentPrice.toFixed(2)} €
                            </div>
                            <div
                                className={`pea-badge ${metrics.changePercent >= 0 ? "pea-badge-green" : "pea-badge-red"}`}
                                style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                            >
                                {metrics.changePercent >= 0 ? "▲" : "▼"} {metrics.changePercent.toFixed(2)}% (5 ans)
                            </div>
                        </div>

                        {/* Plus-value position */}
                        <div className="pea-card pea-card-dots" style={{ padding: "20px 24px", position: "relative" }}>
                            <p className="pea-label" style={{ marginBottom: "8px" }}>Plus-value Position</p>
                            <div style={{ fontSize: "22px", fontWeight: 500, color: metrics.positionGain >= 0 ? "var(--green)" : "var(--red)" }}>
                                {metrics.positionGain >= 0 ? "+" : ""}{metrics.positionGain.toFixed(2)} €
                            </div>
                            <div
                                className={`pea-badge ${metrics.positionGainPercent >= 0 ? "pea-badge-green" : "pea-badge-red"}`}
                                style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                            >
                                {metrics.positionGainPercent >= 0 ? "▲" : "▼"} {metrics.positionGainPercent >= 0 ? "+" : ""}{metrics.positionGainPercent.toFixed(2)}%
                            </div>
                        </div>

                        {/* Range 52 semaines */}
                        <div className="pea-card pea-card-dots" style={{ padding: "20px 24px", position: "relative" }}>
                            <p className="pea-label" style={{ marginBottom: "8px" }}>Range 52 Semaines</p>
                            <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)" }}>
                                {metrics.low52Week.toFixed(2)} – {metrics.high52Week.toFixed(2)} €
                            </div>
                            <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)" }}>
                                Position : {(
                                    ((selectedPosition.currentPrice - metrics.low52Week) /
                                        (metrics.high52Week - metrics.low52Week)) * 100
                                ).toFixed(0)}%
                            </div>
                        </div>

                        {/* Rendement dividendes */}
                        <div className="pea-card pea-card-dots" style={{ padding: "20px 24px", position: "relative" }}>
                            <p className="pea-label" style={{ marginBottom: "8px" }}>Rendement Dividendes</p>
                            <div style={{ fontSize: "22px", fontWeight: 500, color: "var(--ink)" }}>
                                {metrics.dividendYield > 0 ? `${metrics.dividendYield.toFixed(2)}%` : "N/A"}
                            </div>
                            <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)" }}>
                                {metrics.annualDividend > 0
                                    ? `${metrics.annualDividend.toFixed(2)} € / an`
                                    : "Aucun dividende"}
                            </div>
                        </div>
                    </div>

                    {/* Détails + Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>
                                Détails de la Position
                            </h3>
                            <div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Quantité</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{selectedPosition.quantity}</span>
                                </div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Prix d'achat</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{selectedPosition.buyPrice.toFixed(2)} €</span>
                                </div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Investi total</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{metrics.totalInvested.toFixed(2)} €</span>
                                </div>
                                <div style={{ ...rowStyle, borderBottom: "none", paddingTop: "12px", marginTop: "4px" }}>
                                    <span style={{ color: "var(--muted)" }}>Valeur actuelle</span>
                                    <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--ink)" }}>
                                        {metrics.totalValue.toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>
                                Statistiques de Trading
                            </h3>
                            <div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Volume moyen (30j)</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{metrics.avgVolume.toLocaleString("fr-FR")}</span>
                                </div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Plus haut 52 sem.</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{metrics.high52Week.toFixed(2)} €</span>
                                </div>
                                <div style={rowStyle}>
                                    <span style={{ color: "var(--muted)" }}>Plus bas 52 sem.</span>
                                    <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>{metrics.low52Week.toFixed(2)} €</span>
                                </div>
                                <div style={{ ...rowStyle, borderBottom: "none", paddingTop: "12px", marginTop: "4px" }}>
                                    <span style={{ color: "var(--muted)" }}>Performance 5 ans</span>
                                    <span
                                        className={`pea-badge ${metrics.changePercent >= 0 ? "pea-badge-green" : "pea-badge-red"}`}
                                    >
                                        {metrics.changePercent >= 0 ? "▲ +" : "▼ "}{metrics.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Graphe */}
                    <StockAreaChart
                        ticker={selectedPosition.ticker}
                        name={selectedPosition.name || selectedPosition.ticker}
                        historicalData={selectedHistoricalData}
                        loading={historicalLoading}
                    />
                </>
            )}
        </div>
    );
};

export default StockAnalysisPage;
