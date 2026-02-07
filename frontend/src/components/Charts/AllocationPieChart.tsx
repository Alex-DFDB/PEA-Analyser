import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart } from "lucide-react";

import type { Position } from "../../types";
import { calcValue } from "../../utils/calculations";
import { getPositionColor } from "../../utils/colors";
import { SkeletonChart } from "../common/Skeleton";

/**
 * Custom label renderer for pie chart with percentage
 */
const renderCustomLabel = (props: any) => {
    const { name, percent } = props;
    return `${name} (${(percent * 100).toFixed(1)}%)`;
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

    const pieData = positions.map((p) => ({ name: p.name, value: calcValue(p) }));

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
                        >
                            {positions.map((p, i) => (
                                <Cell key={p.ticker} fill={getPositionColor(p, i)} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `€${Number(v).toFixed(2)}`} />
                    </RechartsPie>
                </ResponsiveContainer>
        </div>
    );
};

export default AllocationPieChart;
