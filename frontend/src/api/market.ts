/**
 * Market data API calls (stock quotes, dividends, historical data).
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Quote {
    ticker: string;
    currentPrice: number;
    dividendYield: number;
    name: string;
    error?: string;
}

export interface HistoricalDataPoint {
    Date: string;
    Close: number;
}

export interface HistoricalData {
    ticker: string;
    historical: HistoricalDataPoint[];
    error?: string;
}

export interface DividendPayment {
    date: string;
    amount: number;
    yield?: number;
    priceAtPayment?: number;
}

export interface DividendData {
    ticker: string;
    dividends: DividendPayment[];
    error?: string;
}

/**
 * Get quote for a single ticker.
 */
export const getQuote = async (ticker: string): Promise<Quote> => {
    const response = await axios.get<Quote>(`${API_URL}/market/quote/${ticker}`);
    return response.data;
};

/**
 * Get quotes for multiple tickers.
 */
export const getQuotes = async (tickers: string[]): Promise<Quote[]> => {
    const response = await axios.post<Quote[]>(`${API_URL}/market/quotes`, { tickers });
    return response.data;
};

/**
 * Get historical data for multiple tickers.
 */
export const getHistoricalData = async (tickers: string[]): Promise<HistoricalData[]> => {
    const response = await axios.post<HistoricalData[]>(`${API_URL}/market/historical`, { tickers });
    return response.data;
};

/**
 * Get dividend data for multiple tickers.
 */
export const getDividends = async (tickers: string[]): Promise<DividendData[]> => {
    const response = await axios.post<DividendData[]>(`${API_URL}/market/dividends`, { tickers });
    return response.data;
};
