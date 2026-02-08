import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart } from "lucide-react";

import type { Position } from "../../types";
import { calcValue } from "../../utils/calculations";
import { getPositionColor } from "../../utils/colors";
import { SkeletonChart } from "../common/Skeleton";

/**
 * Custom label renderer for pie chart with percentage and value
 */
const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, percent, value } = props;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position à l'extérieur du graphique
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            <tspan x={x} dy="-7" fontSize="12px" fontWeight="500">
                {name}
            </tspan>
            <tspan x={x} dy="14" fontSize="10px" fill="#d1d5db">
                {`(${(percent * 100).toFixed(1)}% | ${value.toFixed(2)}€)`}
            </tspan>
        </text>
    );
};

/**
 * AllocationPieChart component displays portfolio allocation as a pie chart
 * @param positions - Array of portfolio positions to visualize
 * @param loading - Loading state
 */
const AllocationPieChart = ({ positions, loading = false }: { positions: Position[]; loading?: boolean }) => {
    if (positions.length === 0) return null;

    if (loading) {
        return <SkeletonChart height="400px" />;
    }

    const pieData = positions.map((p) => ({ name: p.name || p.ticker, value: calcValue(p) }));

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">Portfolio Allocation</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                    <RechartsPie>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            label={renderCustomLabel}
                            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                            fill="#8884d8"
                            isAnimationActive={false}
                        >
                            {positions.map((p, i) => (
                                <Cell key={p.ticker} fill={getPositionColor(p, i)} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${Number(v).toFixed(2)}€`} />
                    </RechartsPie>
                </ResponsiveContainer>
        </div>
    );
};

export default AllocationPieChart;
