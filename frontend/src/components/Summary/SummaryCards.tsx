import type { Position } from "../../types";
import { calculateTotals } from "../../utils/calculations";
import SummaryCard from "./SummaryCard";
import { SkeletonCard } from "../common/Skeleton";

const SummaryCards = ({ positions, loading = false }: { positions: Position[]; loading?: boolean }) => {
    const { totalValue, totalInvested, totalPV, totalPVPercent } = calculateTotals(positions);

    if (loading) {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} height="110px" />
                ))}
            </div>
        );
    }

    const pvPositive = totalPV >= 0;
    const pvSign = pvPositive ? "+" : "";

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <SummaryCard
                label="Valeur totale"
                value={<>{totalValue.toFixed(2)} €</>}
            />
            <SummaryCard
                label="Investi"
                value={<>{totalInvested.toFixed(2)} €</>}
            />
            <SummaryCard
                label="Plus-value"
                value={
                    <span style={{ color: pvPositive ? "var(--green)" : "var(--red)" }}>
                        {pvSign}{totalPV.toFixed(2)} €
                    </span>
                }
                delta={`${pvSign}${totalPVPercent.toFixed(2)}%`}
                deltaPositive={pvPositive}
            />
        </div>
    );
};

export default SummaryCards;
