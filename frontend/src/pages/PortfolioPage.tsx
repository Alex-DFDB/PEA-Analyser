// pages/PortfolioPage.tsx
import SummaryCards from "../components/Summary/SummaryCards";
import HistoricalPerformanceChart from "../components/Charts/HistoricalPerformanceChart";
import AllocationPieChart from "../components/Charts/AllocationPieChart";
import PositionsTable from "../components/Positions/PositionsTable";
import ProjectionPanel from "../components/Projection/ProjectionPanel";
import type { Position } from "../types";

/**
 * Props for the PortfolioPage component
 */
interface PortfolioPageProps {
    /** Portfolio positions */
    positions: Position[];
    /** Function to add a new position */
    addPosition: (position: Position) => void;
    /** Function to delete a position by ticker */
    deletePosition: (ticker: string) => void;
    /** Function to update all positions */
    setPositions: (positions: Position[]) => void;
    /** Function to update current prices */
    updatePrices: () => void;
    /** Loading state for price updates */
    loading: boolean;
    /** Function to fetch historical price data */
    fetchHistoricalData: (tickers: string[]) => Promise<void>;
    /** Historical price data by ticker */
    historicalData: { [ticker: string]: any[] };
    /** Historical returns (CAGR) by ticker */
    historicalReturns: { [ticker: string]: number };
}

/**
 * Portfolio page component displaying all portfolio views and analytics
 * @returns Page with summary cards, charts, positions table, and projections
 */
const PortfolioPage = ({
    positions,
    addPosition,
    deletePosition,
    setPositions,
    updatePrices,
    loading,
    fetchHistoricalData,
    historicalData,
    historicalReturns,
}: PortfolioPageProps) => {
    return (
        <div>
            <SummaryCards positions={positions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <HistoricalPerformanceChart positions={positions} historicalData={historicalData} />
                <AllocationPieChart positions={positions} />
                <PositionsTable
                    positions={positions}
                    addPosition={addPosition}
                    deletePosition={deletePosition}
                    setPositions={setPositions}
                    updatePrices={updatePrices}
                    loading={loading}
                    fetchHistoricalData={fetchHistoricalData}
                />
            </div>

            <ProjectionPanel positions={positions} historicalReturns={historicalReturns} />
        </div>
    );
};

export default PortfolioPage;
