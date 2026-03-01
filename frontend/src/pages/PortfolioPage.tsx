// pages/PortfolioPage.tsx
import SummaryCards from "../components/Summary/SummaryCards";
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
    /** Loading state for initial positions fetch */
    positionsLoading: boolean;
    /** Loading state for price updates */
    pricesLoading: boolean;
    /** Loading state for historical data */
    historicalLoading: boolean;
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
    positionsLoading,
    pricesLoading,
    historicalLoading,
    historicalReturns,
}: PortfolioPageProps) => {
    return (
        <div>
            <SummaryCards positions={positions} loading={positionsLoading} />

            <div style={{ marginBottom: "24px" }}>
                <PositionsTable
                    positions={positions}
                    addPosition={addPosition}
                    deletePosition={deletePosition}
                    setPositions={setPositions}
                    updatePrices={updatePrices}
                    loading={positionsLoading || pricesLoading}
                />
            </div>

            <ProjectionPanel
                positions={positions}
                historicalReturns={historicalReturns}
                loading={historicalLoading}
            />
        </div>
    );
};

export default PortfolioPage;
