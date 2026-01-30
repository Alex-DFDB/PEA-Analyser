// components/Charts/AllocationPieChart.tsx
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart } from "lucide-react";

import type { Position } from "../../types";
import { calcValue } from "../../utils/calculations";
import { getPositionColor } from "../../utils/colors";

const AllocationPieChart = ({ positions }: { positions: Position[] }) => {
    if (positions.length === 0) return null;

    const pieData = positions.map((p) => ({ name: p.ticker, value: calcValue(p) }));

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">Allocation</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                        {positions.map((p, i) => (
                            <Cell key={p.ticker} fill={getPositionColor(p, i)} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${Number(v).toFixed(2)} €`} />
                </RechartsPie>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
                {positions.map((p, i) => (
                    <span key={p.ticker} className="text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: getPositionColor(p, i) }} />
                        {p.ticker}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AllocationPieChart;
