import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import type { Position } from "../../types";
import ProjectionControls from "./ProjectionControls";
import { calculateTotals } from "../../utils/calculations";
import { calculateProjection } from "../../utils/projections";
import { getPositionColor } from "../../utils/colors";
import { SkeletonChart } from "../common/Skeleton";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "white",
                border: "1px solid var(--cream-darker)",
                borderRadius: "10px",
                padding: "10px 14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.5px", marginBottom: "6px" }}>
                    Année {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", padding: "2px 0" }}>
                        <span style={{ color: entry.color }}>{entry.name}</span>
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{Number(entry.value).toFixed(2)} €</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const ProjectionPanel = ({
    positions,
    historicalReturns,
    loading = false,
}: {
    positions: Position[];
    historicalReturns: { [ticker: string]: number };
    loading?: boolean;
}) => {
    const [projectionYears, setProjectionYears] = useState(5);
    const [detailedView, setDetailedView] = useState(false);

    if (positions.length === 0) return null;

    const { totalValue } = calculateTotals(positions);
    const projectionData =
        totalValue > 0 && Object.keys(historicalReturns).length > 0
            ? calculateProjection(positions, historicalReturns, projectionYears, detailedView)
            : [];

    if (loading) {
        return <SkeletonChart height="500px" />;
    }

    const lastPoint = projectionData[projectionData.length - 1];

    const summaryCardStyle: React.CSSProperties = {
        backgroundColor: "var(--cream)",
        borderRadius: "10px",
        padding: "14px 16px",
        border: "1px solid var(--cream-darker)",
    };

    return (
        <div className="pea-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                    Projection de croissance
                </h2>
                <ProjectionControls
                    years={projectionYears}
                    onYearsChange={setProjectionYears}
                    detailedView={detailedView}
                    onViewToggle={() => setDetailedView(!detailedView)}
                    hasData={Object.keys(historicalReturns).length > 0}
                />
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="2,8" stroke="rgba(196,168,106,0.3)" />
                    <XAxis
                        dataKey="year"
                        tickFormatter={(y) => `An ${y}`}
                        tick={{ fill: "var(--muted)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                        tick={{ fill: "var(--muted)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "var(--muted)", paddingTop: "12px" }} />
                    {detailedView ? (
                        positions.map((p, i) => (
                            <Line
                                key={p.ticker}
                                type="monotone"
                                dataKey={p.ticker}
                                stroke={getPositionColor(p, i)}
                                strokeWidth={2}
                                dot={false}
                                name={p.name || p.ticker}
                            />
                        ))
                    ) : (
                        <>
                            <Line
                                type="monotone"
                                dataKey="withDividends"
                                stroke="var(--green)"
                                strokeWidth={2}
                                dot={false}
                                name="Avec dividendes réinvestis"
                            />
                            <Line
                                type="monotone"
                                dataKey="withoutDividends"
                                stroke="var(--gold)"
                                strokeWidth={2}
                                dot={false}
                                name="Sans dividendes"
                            />
                        </>
                    )}
                </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "20px" }}>
                <div style={summaryCardStyle}>
                    <p className="pea-label" style={{ marginBottom: "6px" }}>Valeur actuelle</p>
                    <p style={{ fontSize: "18px", fontWeight: 500, color: "var(--ink)", margin: 0 }}>
                        {totalValue.toFixed(2)} €
                    </p>
                </div>
                {detailedView ? (
                    <div style={{ ...summaryCardStyle, gridColumn: "span 2" }}>
                        <p className="pea-label" style={{ marginBottom: "6px" }}>Valeur projetée ({projectionYears} ans)</p>
                        <p style={{ fontSize: "18px", fontWeight: 500, color: "var(--green)", margin: 0 }}>
                            {Object.values(lastPoint || {})
                                .filter((v) => typeof v === "number")
                                .reduce((sum: number, v) => sum + (v as number), 0)
                                .toFixed(2)} €
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={summaryCardStyle}>
                            <p className="pea-label" style={{ marginBottom: "6px" }}>Sans dividendes ({projectionYears} ans)</p>
                            <p style={{ fontSize: "18px", fontWeight: 500, color: "var(--gold)", margin: 0 }}>
                                {lastPoint?.withoutDividends?.toFixed(2)} €
                            </p>
                        </div>
                        <div style={summaryCardStyle}>
                            <p className="pea-label" style={{ marginBottom: "6px" }}>Avec dividendes ({projectionYears} ans)</p>
                            <p style={{ fontSize: "18px", fontWeight: 500, color: "var(--green)", margin: 0 }}>
                                {lastPoint?.withDividends?.toFixed(2)} €
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectionPanel;
