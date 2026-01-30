// hooks/useDividends.ts
import { useState, useEffect } from "react";
import type { Position } from "../types";
import { API_URL } from "../utils/constants";

export type DividendPayment = {
    date: string;
    amount: number;
    yield?: number;
    priceAtPayment?: number;
};

export type DividendData = {
    ticker: string;
    dividends: DividendPayment[];
    error?: string;
};

export type DividendEvent = {
    date: Date;
    ticker: string;
    name: string;
    amount: number;
    yield?: number;
    priceAtPayment?: number;
};

export function useDividends(positions: Position[]) {
    const [dividendData, setDividendData] = useState<DividendData[]>([]);
    const [events, setEvents] = useState<DividendEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDividends = async () => {
            if (positions.length === 0) {
                setDividendData([]);
                setEvents([]);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const tickers = positions.map((p) => p.ticker);
                const response = await fetch(`${API_URL}/api/dividends`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tickers }),
                });

                if (!response.ok) throw new Error("Erreur API dividendes");

                const data: DividendData[] = await response.json();
                setDividendData(data);

                // Convertir en événements pour le calendrier
                const allEvents: DividendEvent[] = [];
                data.forEach((divData) => {
                    const position = positions.find((p) => p.ticker === divData.ticker);
                    if (!position || !divData.dividends) return;

                    divData.dividends.forEach((payment) => {
                        allEvents.push({
                            date: new Date(payment.date),
                            ticker: divData.ticker,
                            name: position.name,
                            amount: payment.amount * position.quantity,
                            yield: payment.yield,
                            priceAtPayment: payment.priceAtPayment,
                        });
                    });
                });

                setEvents(allEvents);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Erreur lors de la récupération des dividendes";
                setError(errorMessage);
                console.error("Erreur lors de la récupération des dividendes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDividends();
    }, [positions]);

    // Calculer les statistiques à partir des événements
    const totalAmount = events.reduce((sum, e) => sum + e.amount, 0);

    const lastPaymentDate = events.length > 0 ? new Date(Math.max(...events.map((e) => e.date.getTime()))) : null;

    // Filtrer les événements par année
    const getEventsByYear = (year: number) => {
        return events.filter((e) => e.date.getFullYear() === year);
    };

    // Calculer le total pour une année
    const getYearTotal = (year: number) => {
        return getEventsByYear(year).reduce((sum, e) => sum + e.amount, 0);
    };

    // Calculer le nombre total de paiements
    const totalPayments = events.length;

    return {
        dividendData,
        events,
        loading,
        error,
        totalAmount,
        totalPayments,
        lastPaymentDate,
        getEventsByYear,
        getYearTotal,
    };
}
