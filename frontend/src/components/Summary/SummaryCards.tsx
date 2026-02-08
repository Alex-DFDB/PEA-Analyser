import { TrendingUp, TrendingDown } from "lucide-react";

import type { Position } from "../../types";
import { calculateTotals } from "../../utils/calculations";
import SummaryCard from "./SummaryCard";
import { SkeletonCard } from "../common/Skeleton";

/**
 * SummaryCards displays key portfolio metrics in a card layout
 * Shows total value, invested amount, and profit/loss with visual indicators
 */
const SummaryCards = ({ positions, loading = false }: { positions: Position[]; loading?: boolean }) => {
    const { totalValue, totalInvested, totalPV, totalPVPercent } = calculateTotals(positions);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} height="120px" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
                label="Total Portfolio Value"
                value={<p className="text-2xl font-bold">{totalValue.toFixed(2)}€</p>}
            />
            <SummaryCard
                label="Total Invested"
                value={<p className="text-2xl font-bold">{totalInvested.toFixed(2)}€</p>}
            />
            <SummaryCard
                label="Profit/Loss"
                trend={
                    totalPV >= 0 ? <TrendingUp className="text-green-400" /> : <TrendingDown className="text-red-400" />
                }
                value={
                    <p className={`text-2xl font-bold ${totalPV >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {totalPV >= 0 ? "+" : ""}{totalPV.toFixed(2)}€ ({totalPVPercent.toFixed(2)}%)
                    </p>
                }
            />
        </div>
    );
};

export default SummaryCards;
