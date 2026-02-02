// types/index.ts

/**
 * Represents a stock position in the portfolio
 */
export type Position = {
    /** Stock ticker symbol (e.g., "AAPL", "GOOGL") */
    ticker: string;
    /** Company or stock name */
    name: string;
    /** Number of shares owned */
    quantity: number;
    /** Purchase price per share */
    buyPrice: number;
    /** Current market price per share */
    currentPrice: number;
    /** Annual dividend yield as a percentage (optional) */
    dividendYield?: number;
    /** Color for charts and visualizations (optional) */
    color?: string;
};
