// components/Charts/HistoricalPerformanceChart.tsx
// components/Charts/HistoricalPerformanceChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

import type { Position } from "../../types";
import { getPositionColor } from "../../utils/colors";

const HistoricalPerformanceChart = ({
    positions,
    historicalData,
}: {
    positions: Position[];
    historicalData: { [ticker: string]: any[] };
}) => {
    if (positions.length === 0) return null;

    const prepareHistoricalChartData = () => {
        if (Object.keys(historicalData).length === 0) return [];

        const allDates = new Set<string>();
        Object.values(historicalData).forEach((data) => {
            data.forEach((point) => allDates.add(point.Date));
        });

        const sortedDates = Array.from(allDates).sort();

        return sortedDates.map((date) => {
            const dataPoint: any = { date };

            positions.forEach((position) => {
                const posData = historicalData[position.ticker];
                if (posData) {
                    const point = posData.find((p) => p.Date === date);
                    if (point) {
                        const firstPrice = posData[0].Close;
                        dataPoint[position.ticker] = (point.Close / firstPrice - 1) * 100;
                    }
                }
            });

            return dataPoint;
        });
    };

    const historicalChartData = prepareHistoricalChartData();

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">Performance historique (5 ans)</h2>
            </div>
            {historicalChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).getFullYear().toString()}
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            formatter={(v: any) => `${v.toFixed(2)}%`}
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Legend />
                        {positions.map((p, i) => (
                            <Line
                                key={p.ticker}
                                type="monotone"
                                dataKey={p.ticker}
                                stroke={getPositionColor(p, i)}
                                strokeWidth={2}
                                dot={false}
                                name={p.ticker}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center py-8">
                    Cliquez sur "Actualiser" pour charger les données historiques
                </p>
            )}
        </div>
    );
};

export default HistoricalPerformanceChart;
