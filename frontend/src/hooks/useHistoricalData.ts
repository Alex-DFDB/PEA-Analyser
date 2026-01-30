// hooks/useHistoricalData.ts
import { useState } from "react";

import { API_URL } from "../utils/constants";
import { calculateHistoricalReturn } from "../utils/projections";

export function useHistoricalData() {
    const [historicalReturns, setHistoricalReturns] = useState<{ [ticker: string]: number }>({});
    const [historicalData, setHistoricalData] = useState<{ [ticker: string]: any[] }>({});

    const fetchHistoricalData = async (tickers: string[]) => {
        try {
            const response = await fetch(`${API_URL}/api/historical`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickers }),
            });

            if (!response.ok) throw new Error("Erreur API historique");

            const data = await response.json();
            const returns: { [ticker: string]: number } = {};
            const historical: { [ticker: string]: any[] } = {};

            data.forEach((item: any) => {
                if (item.historical && item.historical.length > 0) {
                    returns[item.ticker] = calculateHistoricalReturn(item.historical);
                    historical[item.ticker] = item.historical;
                }
            });

            setHistoricalReturns(returns);
            setHistoricalData(historical);
        } catch (error) {
            console.error("Impossible de récupérer les données historiques:", error);
        }
    };

    return { historicalReturns, historicalData, fetchHistoricalData };
}
