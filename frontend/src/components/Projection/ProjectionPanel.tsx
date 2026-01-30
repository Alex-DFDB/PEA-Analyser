// components/Projection/ProjectionPanel.tsx
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

import type { Position } from "../../types";
import ProjectionControls from "./ProjectionControls";
import { calculateTotals } from "../../utils/calculations";
import { calculateProjection } from "../../utils/projections";
import { getPositionColor } from "../../utils/colors";

const ProjectionPanel = ({
    positions,
    historicalReturns,
}: {
    positions: Position[];
    historicalReturns: { [ticker: string]: number };
}) => {
    const [projectionYears, setProjectionYears] = useState(5);
    const [detailedView, setDetailedView] = useState(false);

    if (positions.length === 0) return null;

    const { totalValue } = calculateTotals(positions);
    const projectionData =
        totalValue > 0 && Object.keys(historicalReturns).length > 0
            ? calculateProjection(positions, historicalReturns, projectionYears, detailedView)
            : [];

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h2 className="font-semibold">Projection de croissance</h2>
                </div>
                <ProjectionControls
                    years={projectionYears}
                    onYearsChange={setProjectionYears}
                    detailedView={detailedView}
                    onViewToggle={() => setDetailedView(!detailedView)}
                    hasData={Object.keys(historicalReturns).length > 0}
                />
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" tickFormatter={(y) => `Année ${y}`} stroke="#9ca3af" fontSize={12} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} stroke="#9ca3af" fontSize={12} />
                    <Tooltip formatter={(v) => `${Number(v).toFixed(0)} €`} labelFormatter={(y) => `Année ${y}`} />
                    <Legend />
                    {detailedView ? (
                        positions.map((p, i) => (
                            <Line
                                key={p.ticker}
                                type="monotone"
                                dataKey={p.ticker}
                                stroke={getPositionColor(p, i)}
                                strokeWidth={2}
                                dot={false}
                                name={p.ticker}
                            />
                        ))
                    ) : (
                        <>
                            <Line
                                type="monotone"
                                dataKey="withDividends"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                name="Avec dividendes réinvestis"
                            />
                            <Line
                                type="monotone"
                                dataKey="withoutDividends"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                name="Sans dividendes"
                            />
                        </>
                    )}
                </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-center">
                <div className="bg-gray-700 rounded p-2">
                    <p className="text-gray-400">Valeur actuelle</p>
                    <p className="text-blue-400 font-bold">{totalValue.toFixed(0)} €</p>
                </div>
                {detailedView ? (
                    <div className="bg-gray-700 rounded p-2">
                        <p className="text-gray-400">Valeur projetée ({projectionYears} ans)</p>
                        <p className="text-green-400 font-bold">
                            {Object.values(projectionData[projectionData.length - 1] || {})
                                .filter((v) => typeof v === "number")
                                .reduce((sum: number, v) => sum + (v as number), 0)
                                .toFixed(0)}{" "}
                            €
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-700 rounded p-2">
                            <p className="text-gray-400">Sans dividendes ({projectionYears} ans)</p>
                            <p className="text-blue-400 font-bold">
                                {projectionData[projectionData.length - 1]?.withoutDividends.toFixed(0)} €
                            </p>
                        </div>
                        <div className="bg-gray-700 rounded p-2 col-span-2">
                            <p className="text-gray-400">Avec dividendes réinvestis ({projectionYears} ans)</p>
                            <p className="text-green-400 font-bold">
                                {projectionData[projectionData.length - 1]?.withDividends.toFixed(0)} €
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectionPanel;
