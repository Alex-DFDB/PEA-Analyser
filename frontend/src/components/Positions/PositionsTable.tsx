import { useState } from "react";

import PositionsActions from "./PositionsActions";
import PositionForm from "./PositionForm";
import PositionRow from "./PositionRow";
import type { Position } from "../../types";

import { useQuote } from "../../hooks/useQuote";
import { useQuotes } from "../../hooks/useQuotes";
import { generateRandomColor } from "../../utils/colors";

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
    fetchHistoricalData,
}: {
    positions: Position[];
    addPosition: (position: Position) => void;
    deletePosition: (ticker: string) => void;
    setPositions: (positions: Position[]) => void;
    updatePrices: () => void;
    loading: boolean;
    fetchHistoricalData: (tickers: string[]) => Promise<void>;
}) => {
    const [showForm, setShowForm] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    const { fetchQuote, loading: addLoading } = useQuote();
    const { fetchQuotes } = useQuotes();

    /**
     * Handles adding a new position with real-time price data
     * Falls back to buy price if quote fetch fails
     */
    const handleAddPosition = async (
        ticker: string,
        name: string,
        quantity: number,
        buyPrice: number,
        color?: string,
    ) => {
        try {
            const quote = await fetchQuote(ticker);

            const newPosition: Position = {
                ticker: ticker.toUpperCase(),
                name: quote.name || name,
                quantity,
                buyPrice,
                currentPrice: quote.currentPrice || buyPrice,
                dividendYield: quote.dividendYield,
                color: color || generateRandomColor(),
            };

            addPosition(newPosition);
            await fetchHistoricalData([ticker]);
            setShowForm(false);
        } catch (error) {
            alert("Unable to fetch quote data. Position added with buy price.");

            const newPosition: Position = {
                ticker: ticker.toUpperCase(),
                name,
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
     * Fetches current prices for all tickers and merges with existing positions
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
                    const tickers = data.map((p) => p.ticker);

                    try {
                        const quotes = await fetchQuotes(tickers);

                        const newPositions = data.map((p) => {
                            const quote = quotes.find((q: any) => q.ticker === p.ticker.toUpperCase());
                            return {
                                ticker: p.ticker.toUpperCase(),
                                quantity: p.quantity,
                                buyPrice: p.buyPrice,
                                currentPrice: quote?.currentPrice || p.buyPrice,
                                dividendYield: quote?.dividendYield,
                                name: quote?.name || p.name || p.ticker,
                                color: p.color || generateRandomColor(),
                            };
                        });

                        const updatedPositions = [...positions];
                        newPositions.forEach((newPos) => {
                            const existingIndex = updatedPositions.findIndex((p) => p.ticker === newPos.ticker);
                            if (existingIndex >= 0) {
                                updatedPositions[existingIndex] = newPos;
                            } else {
                                updatedPositions.push(newPos);
                            }
                        });

                        setPositions(updatedPositions);
                        await fetchHistoricalData(tickers);
                    } catch (error) {
                        alert("Unable to fetch prices. Positions added with buy prices.");
                        const newPositions = data.map((p) => ({
                            ticker: p.ticker.toUpperCase(),
                            quantity: p.quantity,
                            buyPrice: p.buyPrice,
                            currentPrice: p.buyPrice,
                            name: p.name || p.ticker,
                            color: p.color || generateRandomColor(),
                        }));

                        const updatedPositions = [...positions];
                        newPositions.forEach((newPos) => {
                            const existingIndex = updatedPositions.findIndex((p) => p.ticker === newPos.ticker);
                            if (existingIndex >= 0) {
                                updatedPositions[existingIndex] = newPos;
                            } else {
                                updatedPositions.push(newPos);
                            }
                        });

                        setPositions(updatedPositions);
                    } finally {
                        setUploadLoading(false);
                    }
                }
            } catch {
                alert("Invalid JSON file");
                setUploadLoading(false);
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    return (
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Positions</h2>
                <PositionsActions
                    onRefresh={updatePrices}
                    onAdd={() => setShowForm(!showForm)}
                    onImport={handleFileUpload}
                    loading={loading || uploadLoading}
                    hasPositions={positions.length > 0}
                />
            </div>

            {showForm && (
                <PositionForm onSubmit={handleAddPosition} onCancel={() => setShowForm(false)} loading={addLoading} />
            )}

            {positions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No positions yet. Click "Add" to get started.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400 text-left">
                                <th className="pb-2">Ticker</th>
                                <th className="pb-2">Quantity</th>
                                <th className="pb-2">Buy Price</th>
                                <th className="pb-2">Current Price</th>
                                <th className="pb-2">Total Value</th>
                                <th className="pb-2">Profit/Loss</th>
                                <th className="pb-2">Avg. Dividend (5Y)</th>
                                <th className="pb-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map((p) => (
                                <PositionRow key={p.ticker} position={p} onDelete={() => deletePosition(p.ticker)} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PositionsTable;
