// hooks/useQuote.ts
import { useState } from "react";
import { API_URL } from "../utils/constants";

export function useQuote() {
    const [loading, setLoading] = useState(false);

    const fetchQuote = async (ticker: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/quote/${ticker}`);
            if (!response.ok) throw new Error("Erreur API");

            const quote = await response.json();
            return quote;
        } catch (error) {
            console.error("Erreur récupération quote:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { fetchQuote, loading };
}
