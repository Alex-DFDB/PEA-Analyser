// pages/PortfolioPage.tsx
import SummaryCards from "../components/Summary/SummaryCards";
import HistoricalPerformanceChart from "../components/Charts/HistoricalPerformanceChart";
import AllocationPieChart from "../components/Charts/AllocationPieChart";
import PositionsTable from "../components/Positions/PositionsTable";
import ProjectionPanel from "../components/Projection/ProjectionPanel";
import type { Position } from "../types";

interface PortfolioPageProps {
    positions: Position[];
    addPosition: (position: Position) => void;
    deletePosition: (ticker: string) => void;
    setPositions: (positions: Position[]) => void;
    updatePrices: () => void;
    loading: boolean;
    fetchHistoricalData: (tickers: string[]) => Promise<void>;
    historicalData: { [ticker: string]: any[] };
    historicalReturns: { [ticker: string]: number };
}

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
