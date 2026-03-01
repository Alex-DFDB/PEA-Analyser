import { useState } from "react";

import PositionsActions from "./PositionsActions";
import PositionForm from "./PositionForm";
import PositionRow from "./PositionRow";
import type { Position } from "../../types";

import { useQuote } from "../../hooks/useQuote";
import { useQuotes } from "../../hooks/useQuotes";
import { generateRandomColor } from "../../utils/colors";
import { bulkImportPositions } from "../../api/portfolio";
import Skeleton from "../common/Skeleton";

/**
 * PositionsTable manages the display and manipulation of portfolio positions
 * Handles adding positions (manually or via JSON import), deleting positions, and updating prices
 */
const PositionsTable = ({
    positions,
    addPosition,
    deletePosition,
    setPositions,
    updatePrices,
    loading,
}: {
    positions: Position[];
    addPosition: (position: Position) => void;
    deletePosition: (ticker: string) => void;
    setPositions: (positions: Position[]) => void;
    updatePrices: () => void;
    loading: boolean;
}) => {
    const [showForm, setShowForm] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [sortKey, setSortKey] = useState<string>("value");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const getSortValue = (p: Position, key: string): number | string => {
        switch (key) {
            case "name":    return (p.name || p.ticker).toLowerCase();
            case "qty":     return p.quantity;
            case "buy":     return p.buyPrice;
            case "current": return p.currentPrice;
            case "value":   return p.currentPrice * p.quantity;
            case "pv":      return (p.currentPrice - p.buyPrice) * p.quantity;
            case "weight":  return p.currentPrice * p.quantity;
            default:        return 0;
        }
    };

    const { fetchQuote, loading: addLoading } = useQuote();
    const { fetchQuotes } = useQuotes();

    /**
     * Handles adding a new position with real-time price data
     * Falls back to buy price if quote fetch fails
     */
    const handleAddPosition = async (ticker: string, quantity: number, buyPrice: number, color?: string) => {
        try {
            const quote = await fetchQuote(ticker);

            const newPosition: Position = {
                ticker: ticker.toUpperCase(),
                name: quote.name,
                quantity,
                buyPrice,
                currentPrice: quote.currentPrice || buyPrice,
                dividendYield: quote.dividendYield,
                color: color || generateRandomColor(),
            };

            addPosition(newPosition);
            setShowForm(false);
        } catch (error) {
            alert("Unable to fetch quote data. Position added with buy price.");

            const newPosition: Position = {
                ticker: ticker.toUpperCase(),
                quantity,
                buyPrice,
                currentPrice: buyPrice,
                color: color || generateRandomColor(),
            };

            addPosition(newPosition);
            setShowForm(false);
        }
    };

    /**
     * Handles JSON file upload for bulk position import
     * Saves positions to the database and fetches current prices
     */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadLoading(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (Array.isArray(data)) {
                    // Import positions to database
                    const importedPositions = await bulkImportPositions(data);

                    // Fetch quotes for all tickers
                    const tickers = importedPositions.map((p) => p.ticker);

                    try {
                        const quotes = await fetchQuotes(tickers);

                        // Map positions with current prices
                        const updatedPositions = importedPositions.map((p: any) => {
                            const quote = quotes.find((q: any) => q.ticker === p.ticker);
                            const buyPrice = p.buy_price || p.buyPrice;
                            return {
                                id: p.id,
                                ticker: p.ticker,
                                quantity: p.quantity,
                                buyPrice: buyPrice,
                                currentPrice: quote?.currentPrice || buyPrice,
                                dividendYield: quote?.dividendYield,
                                name: quote?.name,
                                color: p.color,
                                created_at: p.created_at,
                                updated_at: p.updated_at,
                            };
                        });

                        setPositions(updatedPositions);
                    } catch (error) {
                        console.error("Failed to fetch quotes:", error);
                        // Map positions with buy prices as fallback
                        const fallbackPositions = importedPositions.map((p: any) => {
                            const buyPrice = p.buy_price || p.buyPrice;
                            return {
                                id: p.id,
                                ticker: p.ticker,
                                quantity: p.quantity,
                                buyPrice: buyPrice,
                                currentPrice: buyPrice,
                                color: p.color,
                                created_at: p.created_at,
                                updated_at: p.updated_at,
                            };
                        });
                        setPositions(fallbackPositions);
                    }

                    setUploadLoading(false);
                }
            } catch (error) {
                console.error("Import failed:", error);
                alert("Failed to import positions. Please try again.");
                setUploadLoading(false);
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const thStyle: React.CSSProperties = {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "var(--muted)",
        textAlign: "left",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--cream-darker)",
        userSelect: "none",
        whiteSpace: "nowrap",
    };

    const SortTh = ({ label, sortId, align = "left" }: { label: string; sortId: string; align?: "left" | "right" }) => {
        const active = sortKey === sortId;
        return (
            <th
                style={{ ...thStyle, textAlign: align, cursor: "pointer" }}
                onClick={() => handleSort(sortId)}
            >
                <span style={{ color: active ? "var(--ink)" : "var(--muted)" }}>
                    {label}
                    <span style={{ marginLeft: "4px", opacity: active ? 1 : 0.35 }}>
                        {active && sortDir === "asc" ? "▲" : "▼"}
                    </span>
                </span>
            </th>
        );
    };

    return (
        <div className="pea-card" style={{ padding: "24px", gridColumn: "span 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--ink)",
                    }}
                >
                    Positions
                </h2>
                <PositionsActions
                    onRefresh={updatePrices}
                    onAdd={() => setShowForm(!showForm)}
                    onImport={handleFileUpload}
                    loading={loading || uploadLoading}
                    hasPositions={positions.length > 0}
                />
            </div>

            {showForm && <PositionForm onSubmit={handleAddPosition} onCancel={() => setShowForm(false)} loading={addLoading} />}

            {positions.length === 0 ? (
                loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : (
                    <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0", fontSize: "13px" }}>
                        Aucune position. Cliquez sur « Ajouter » pour commencer.
                    </p>
                )
            ) : loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <SortTh label="Valeur"       sortId="name" />
                                <SortTh label="Quantité"     sortId="qty" />
                                <SortTh label="Prix achat"   sortId="buy" />
                                <SortTh label="Prix actuel"  sortId="current" />
                                <SortTh label="Valeur totale" sortId="value" />
                                <SortTh label="Plus-value"   sortId="pv" />
                                <SortTh label="Poids"        sortId="weight" />
                                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const total = positions.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);
                                const sorted = [...positions].sort((a, b) => {
                                    const va = getSortValue(a, sortKey);
                                    const vb = getSortValue(b, sortKey);
                                    if (va < vb) return sortDir === "asc" ? -1 : 1;
                                    if (va > vb) return sortDir === "asc" ? 1 : -1;
                                    return 0;
                                });
                                return sorted.map((p) => (
                                    <PositionRow key={p.ticker} position={p} onDelete={() => deletePosition(p.ticker)} totalPortfolioValue={total} />
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PositionsTable;
