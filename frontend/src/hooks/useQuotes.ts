// hooks/useQuotes.ts
import { useState } from "react";
import { API_URL } from "../utils/constants";

/**
 * Hook for fetching multiple stock quotes from the API
 * @returns Object containing fetchQuotes function and loading state
 */
export function useQuotes() {
    const [loading, setLoading] = useState(false);

    const fetchQuotes = async (tickers: string[]) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/quotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickers }),
            });

            if (!response.ok) throw new Error("API error");

            const quotes = await response.json();
            return quotes;
        } catch (error) {
            console.error("Error fetching quotes:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { fetchQuotes, loading };
}
