// hooks/usePriceUpdate.ts
import { useState } from "react";

import type { Position } from "../types";
import { API_URL } from "../utils/constants";

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

            if (!response.ok) throw new Error("Erreur API");

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
            alert("Erreur lors de la mise à jour des prix. Vérifiez que le serveur FastAPI est lancé.");
        } finally {
            setLoading(false);
        }
    };

    return { updatePrices, loading };
}
