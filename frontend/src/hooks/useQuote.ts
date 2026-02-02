// hooks/useQuote.ts
import { useState } from "react";
import { API_URL } from "../utils/constants";

/**
 * Hook for fetching stock quote data from the API
 * @returns Object containing fetchQuote function and loading state
 */
export function useQuote() {
    const [loading, setLoading] = useState(false);

    const fetchQuote = async (ticker: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/quote/${ticker}`);
            if (!response.ok) throw new Error("API error");

            const quote = await response.json();
            return quote;
        } catch (error) {
            console.error("Error fetching quote:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { fetchQuote, loading };
}
