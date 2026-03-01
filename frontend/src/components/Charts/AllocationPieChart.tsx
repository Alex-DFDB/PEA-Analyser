import type { Position } from "../../types";
import { calcValue } from "../../utils/calculations";
import { getPositionColor } from "../../utils/colors";
import { SkeletonChart } from "../common/Skeleton";

const AllocationPieChart = ({ positions, loading = false }: { positions: Position[]; loading?: boolean }) => {
    if (positions.length === 0) return null;

    if (loading) {
        return <SkeletonChart height="200px" />;
    }

    const totalValue = positions.reduce((sum, p) => sum + calcValue(p), 0);
    const sorted = [...positions].sort((a, b) => calcValue(b) - calcValue(a));
    const maxValue = calcValue(sorted[0]);

    return (
        <div className="pea-card" style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                Allocation du portefeuille
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                    <tr>
                        {["Valeur", "Prix actuel", "Valeur totale", "Poids", ""].map((h, i) => (
                            <th
                                key={i}
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    color: "var(--muted)",
                                    textAlign: i === 0 ? "left" : i === 4 ? "left" : "right",
                                    paddingBottom: "10px",
                                    paddingRight: i < 4 ? "16px" : "0",
                                    borderBottom: "1px solid var(--cream-darker)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((p, i) => {
                        const value = calcValue(p);
                        const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
                        const color = getPositionColor(p, i);

                        return (
                            <tr key={p.ticker}>
                                <td style={{ padding: "10px 16px 10px 0", borderBottom: "1px solid var(--cream-dark)", verticalAlign: "middle" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                                        <div>
                                            <span style={{ fontWeight: 500, color: "var(--ink)", display: "block" }}>
                                                {p.name || p.ticker}
                                            </span>
                                            <span style={{ fontSize: "10px", color: "var(--muted)" }}>{p.ticker}</span>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "10px 16px 10px 0", borderBottom: "1px solid var(--cream-dark)", color: "var(--ink-soft)", textAlign: "right", verticalAlign: "middle" }}>
                                    {p.currentPrice.toFixed(2)} €
                                </td>
                                <td style={{ padding: "10px 16px 10px 0", borderBottom: "1px solid var(--cream-dark)", fontWeight: 500, color: "var(--ink)", textAlign: "right", verticalAlign: "middle" }}>
                                    {value.toFixed(2)} €
                                </td>
                                <td style={{ padding: "10px 16px 10px 0", borderBottom: "1px solid var(--cream-dark)", textAlign: "right", verticalAlign: "middle" }}>
                                    <span className="pea-badge pea-badge-green">{pct.toFixed(1)}%</span>
                                </td>
                                <td style={{ padding: "10px 0", borderBottom: "1px solid var(--cream-dark)", verticalAlign: "middle", width: "120px" }}>
                                    <div style={{ height: "4px", backgroundColor: "var(--cream-darker)", borderRadius: "2px", overflow: "hidden" }}>
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
                                                backgroundColor: color,
                                                borderRadius: "2px",
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AllocationPieChart;
