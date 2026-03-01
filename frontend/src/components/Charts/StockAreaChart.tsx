import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
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
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px" }}>
                    <span style={{ color: "var(--muted)" }}>Prix</span>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{payload[0].value.toFixed(2)} €</span>
                </div>
                {payload[0].payload.volume && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "12px", marginTop: "2px" }}>
                        <span style={{ color: "var(--muted)" }}>Volume</span>
                        <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>
                            {payload[0].payload.volume.toLocaleString("fr-FR")}
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const StockAreaChart = ({
    ticker,
    name,
    historicalData,
    loading = false,
}: {
    ticker: string;
    name: string;
    historicalData: any[];
    loading?: boolean;
}) => {
    if (loading) {
        return <SkeletonChart height="400px" />;
    }

    if (!historicalData || historicalData.length === 0) {
        return (
            <div className="pea-card" style={{ padding: "24px" }}>
                <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                    Prix Historique
                </h2>
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0", fontSize: "13px", margin: 0 }}>
                    Cliquez sur « Actualiser » pour charger les données
                </p>
            </div>
        );
    }

    const chartData = historicalData.map((point) => ({
        date: point.Date,
        price: point.Close,
        volume: point.Volume,
    }));

    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const yAxisMin = Math.floor(minPrice - priceRange * 0.1);
    const yAxisMax = Math.ceil(maxPrice + priceRange * 0.1);

    return (
        <div className="pea-card" style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                Prix Historique — {name} ({ticker})
            </h2>
            <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C4A86A" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#C4A86A" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2,8" stroke="rgba(196,168,106,0.3)" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                            const d = new Date(date);
                            return d.getMonth() === 0
                                ? d.getFullYear().toString()
                                : d.toLocaleDateString("fr-FR", { month: "short" });
                        }}
                        tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[yAxisMin, yAxisMax]}
                        tickFormatter={(v) => `${v.toFixed(0)} €`}
                        tick={{ fill: "var(--muted)", fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#C4A86A"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockAreaChart;
