// hooks/usePriceUpdate.ts
import { useState } from "react";

import type { Position } from "../types";
import { API_URL } from "../utils/constants";

/**
 * Hook for updating current prices and dividend yields for positions
 * @param positions Current array of positions
 * @param setPositions Function to update positions state
 * @param fetchHistoricalData Function to fetch historical data after price update
 * @returns Object containing updatePrices function and loading state
 */
export function usePriceUpdate(
    positions: Position[],
    setPositions: (positions: Position[]) => void,
    fetchHistoricalData: (tickers: string[]) => Promise<void>,
) {
    const [loading, setLoading] = useState(false);

    const updatePrices = async () => {
        if (positions.length === 0) return;

        setLoading(true);
        try {
            const tickers = positions.map((p) => p.ticker);
            const response = await fetch(`${API_URL}/api/quotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickers }),
            });

            if (!response.ok) throw new Error("API error");

            const data = await response.json();

            const updatedPositions = positions.map((pos) => {
                const quote = data.find((q: any) => q.ticker === pos.ticker);
                if (quote && quote.currentPrice) {
                    return {
                        ...pos,
                        currentPrice: quote.currentPrice,
                        dividendYield: quote.dividendYield || pos.dividendYield,
                    };
                }
                return pos;
            });

            setPositions(updatedPositions);
            await fetchHistoricalData(tickers);
        } catch (error) {
            alert("Error updating prices. Please verify that the FastAPI server is running.");
        } finally {
            setLoading(false);
        }
    };

    return { updatePrices, loading };
}
