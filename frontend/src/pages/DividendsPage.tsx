// pages/DividendsPage.tsx
import DividendCalendar from "../components/Dividends/DividendCalendar";
import type { Position } from "../types";

/**
 * Props for the DividendsPage component
 */
interface DividendsPageProps {
    /** Portfolio positions */
    positions: Position[];
    /** Dividend state containing data, events, loading state, and helper functions */
    dividendState: {
        dividendData: any[];
        events: any[];
        loading: boolean;
        error: string | null;
        totalAmount: number;
        totalPayments: number;
        lastPaymentDate: Date | null;
        getEventsByYear: (year: number) => any[];
        getYearTotal: (year: number) => number;
    };
}

/**
 * Dividends page component displaying dividend calendar and statistics
 * @param positions - Portfolio positions
 * @param dividendState - Dividend data and statistics
 * @returns Page with dividend calendar and analytics
 */
const DividendsPage = ({ positions, dividendState }: DividendsPageProps) => {
    return (
        <div>
            <DividendCalendar positions={positions} dividendState={dividendState} />
        </div>
    );
};

export default DividendsPage;
