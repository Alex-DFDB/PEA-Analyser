// pages/DividendsPage.tsx
import DividendCalendar from "../components/Dividends/DividendCalendar";
import type { Position } from "../types";

interface DividendsPageProps {
    positions: Position[];
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

const DividendsPage = ({ positions, dividendState }: DividendsPageProps) => {
    return (
        <div>
            <DividendCalendar positions={positions} dividendState={dividendState} />
        </div>
    );
};

export default DividendsPage;
