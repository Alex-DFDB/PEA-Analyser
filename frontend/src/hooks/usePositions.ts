// hooks/usePositions.ts
import { useState, useEffect } from "react";
import { getPositions } from "../api/portfolio";
import type { Position } from "../types/index";
import { API_URL } from "../utils/constants";

/**
 * Hook for managing portfolio positions state
 * Loads positions from the database on mount
 * @returns Object containing positions array and management functions
 */
export function usePositions() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Load positions from database on mount and fetch quotes to get names
     */
    useEffect(() => {
        const loadPositions = async () => {
            setLoading(true);
            try {
                const data = await getPositions();

                if (data.length > 0) {
                    // Set positions immediately so historical/dividends can start fetching in parallel
                    const initialPositions = data.map(p => ({
                        ...p,
                        currentPrice: p.buyPrice,
                    }));
                    setPositions(initialPositions);

                    // Then fetch quotes to enrich with names and current prices
                    try {
                        const tickers = data.map(p => p.ticker);
                        const response = await fetch(`${API_URL}/api/quotes`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ tickers }),
                        });

                        if (response.ok) {
                            const quotes = await response.json();

                            const enrichedPositions = data.map(p => {
                                const quote = quotes.find((q: any) => q.ticker === p.ticker);
                                return {
                                    ...p,
                                    currentPrice: quote?.currentPrice || p.buyPrice,
                                    name: quote?.name,
                                    dividendYield: quote?.dividendYield,
                                };
                            });
                            setPositions(enrichedPositions);
                        }
                    } catch (error) {
                        console.error("Failed to fetch quotes:", error);
                    }
                } else {
                    setPositions([]);
                }
            } catch (error) {
                console.error("Failed to load positions:", error);
                // Don't throw - just keep empty positions array
            } finally {
                setLoading(false);
            }
        };

        loadPositions();
    }, []);

    /**
     * Add a new position or update an existing one
     * If position with same ticker exists, it will be replaced
     * @param newPosition - Position to add or update
     */
    const addPosition = (newPosition: Position) => {
        const existingIndex = positions.findIndex((p) => p.ticker === newPosition.ticker);
        if (existingIndex >= 0) {
            const updatedPositions = [...positions];
            updatedPositions[existingIndex] = newPosition;
            setPositions(updatedPositions);
        } else {
            setPositions([...positions, newPosition]);
        }
    };

    /**
     * Delete a position by ticker symbol
     * @param ticker - Ticker symbol of position to delete
     */
    const deletePosition = (ticker: string) => {
        setPositions(positions.filter((p) => p.ticker !== ticker));
    };

    return { positions, addPosition, deletePosition, setPositions, loading };
}
