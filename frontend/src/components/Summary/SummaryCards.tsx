// components/Summary/SummaryCards.tsx
import { TrendingUp, TrendingDown } from "lucide-react";

import type { Position } from "../../types";
import { calculateTotals } from "../../utils/calculations";
import SummaryCard from "./SummaryCard";

const SummaryCards = ({ positions }: { positions: Position[] }) => {
    const { totalValue, totalInvested, totalPV, totalPVPercent } = calculateTotals(positions);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
                label="Valeur totale"
                value={<p className="text-2xl font-bold">{totalValue.toFixed(2)} €</p>}
            />
            <SummaryCard label="Investi" value={<p className="text-2xl font-bold">{totalInvested.toFixed(2)} €</p>} />
            <SummaryCard
                label="+/- Value"
                trend={
                    totalPV >= 0 ? <TrendingUp className="text-green-400" /> : <TrendingDown className="text-red-400" />
                }
                value={
                    <p className={`text-2xl font-bold ${totalPV >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {totalPV >= 0 ? "+" : ""}
                        {totalPV.toFixed(2)} € ({totalPVPercent.toFixed(2)}%)
                    </p>
                }
            />
        </div>
    );
};

export default SummaryCards;
