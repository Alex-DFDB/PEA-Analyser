// types/index.ts

/**
 * Represents a user account
 */
export type User = {
    /** Unique user ID */
    id: number;
    /** User email address */
    email: string;
    /** Username */
    username: string;
    /** Account active status */
    is_active: boolean;
    /** Account creation timestamp */
    created_at: string;
};

/**
 * Represents a stock position in the portfolio
 */
export type Position = {
    /** Database ID */
    id?: number;
    /** Stock ticker symbol (e.g., "AAPL", "GOOGL") */
    ticker: string;
    /** Company or stock name (from API quote, not stored in DB) */
    name?: string;
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
    /** Creation timestamp */
    created_at?: string;
    /** Last update timestamp */
    updated_at?: string;
};
