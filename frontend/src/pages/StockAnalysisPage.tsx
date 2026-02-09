import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity, Percent } from "lucide-react";
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

    if (positions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Aucune position dans votre portefeuille</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with stock selector */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Analyse par Action</h1>
                <div className="flex items-center gap-4">
                    <label htmlFor="stock-selector" className="text-sm font-medium text-gray-300">
                        Sélectionner une action:
                    </label>
                    <select
                        id="stock-selector"
                        value={selectedTicker}
                        onChange={(e) => setSelectedTicker(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 min-w-[250px]"
                    >
                        {positions.map((position) => (
                            <option key={position.ticker} value={position.ticker}>
                                {position.name || position.ticker} ({position.ticker})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedPosition && metrics && (
                <>
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Current Price */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Prix Actuel</span>
                            </div>
                            <div className="text-2xl font-bold">{selectedPosition.currentPrice.toFixed(2)} €</div>
                            <div
                                className={`text-sm mt-1 flex items-center gap-1 ${
                                    metrics.changePercent >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {metrics.changePercent >= 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {metrics.changePercent.toFixed(2)}% (5 ans)
                            </div>
                        </div>

                        {/* Position Gain/Loss */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Plus/Moins Value</span>
                            </div>
                            <div
                                className={`text-2xl font-bold ${
                                    metrics.positionGain >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {metrics.positionGain >= 0 ? "+" : ""}
                                {metrics.positionGain.toFixed(2)} €
                            </div>
                            <div
                                className={`text-sm mt-1 ${
                                    metrics.positionGainPercent >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {metrics.positionGainPercent >= 0 ? "+" : ""}
                                {metrics.positionGainPercent.toFixed(2)}%
                            </div>
                        </div>

                        {/* 52 Week Range */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Range 52 Semaines</span>
                            </div>
                            <div className="text-lg font-semibold">
                                {metrics.low52Week.toFixed(2)} € - {metrics.high52Week.toFixed(2)} €
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Position:{" "}
                                {(
                                    ((selectedPosition.currentPrice - metrics.low52Week) /
                                        (metrics.high52Week - metrics.low52Week)) *
                                    100
                                ).toFixed(0)}
                                %
                            </div>
                        </div>

                        {/* Dividend Yield */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Percent className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Rendement Dividendes</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {metrics.dividendYield > 0 ? `${metrics.dividendYield.toFixed(2)}%` : "N/A"}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                                {metrics.annualDividend > 0
                                    ? `${metrics.annualDividend.toFixed(2)} € / an`
                                    : "Pas de dividendes"}
                            </div>
                        </div>
                    </div>

                    {/* Position Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                Détails de la Position
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quantité:</span>
                                    <span className="font-semibold">{selectedPosition.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Prix d'Achat:</span>
                                    <span className="font-semibold">{selectedPosition.buyPrice.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Investissement Total:</span>
                                    <span className="font-semibold">{metrics.totalInvested.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                                    <span className="text-gray-400">Valeur Actuelle:</span>
                                    <span className="font-bold text-lg">{metrics.totalValue.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                Statistiques de Trading
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Volume Moyen (30j):</span>
                                    <span className="font-semibold">{metrics.avgVolume.toLocaleString("fr-FR")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Plus Haut 52 Semaines:</span>
                                    <span className="font-semibold">{metrics.high52Week.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Plus Bas 52 Semaines:</span>
                                    <span className="font-semibold">{metrics.low52Week.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                                    <span className="text-gray-400">Performance 5 Ans:</span>
                                    <span
                                        className={`font-bold ${
                                            metrics.changePercent >= 0 ? "text-green-400" : "text-red-400"
                                        }`}
                                    >
                                        {metrics.changePercent >= 0 ? "+" : ""}
                                        {metrics.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Chart */}
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
