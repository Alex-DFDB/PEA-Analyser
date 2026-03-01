import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

import type { Position } from "../../types";
import { getPositionColor } from "../../utils/colors";
import { formatDate } from "../../utils/date";
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
                    {formatDate(new Date(label))}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", padding: "2px 0" }}>
                        <span style={{ color: entry.color }}>{entry.name}</span>
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{entry.value.toFixed(2)}%</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const HistoricalPerformanceChart = ({
    positions,
    historicalData,
    loading = false,
}: {
    positions: Position[];
    historicalData: { [ticker: string]: any[] };
    loading?: boolean;
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

    if (loading) {
        return <SkeletonChart height="400px" />;
    }

    return (
        <div className="pea-card" style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                Performance historique (5 ans)
            </h2>
            {historicalChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="2,8" stroke="rgba(196,168,106,0.3)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).getFullYear().toString()}
                            tick={{ fill: "var(--muted)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(v) => `${v.toFixed(0)}%`}
                            tick={{ fill: "var(--muted)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "11px", color: "var(--muted)", paddingTop: "12px" }} />
                        {positions.map((p, i) => (
                            <Line
                                key={p.ticker}
                                type="monotone"
                                dataKey={p.ticker}
                                stroke={getPositionColor(p, i)}
                                strokeWidth={2}
                                dot={false}
                                name={p.name || p.ticker}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0", fontSize: "13px" }}>
                    Cliquez sur « Actualiser » pour charger les données historiques
                </p>
            )}
        </div>
    );
};

export default HistoricalPerformanceChart;
