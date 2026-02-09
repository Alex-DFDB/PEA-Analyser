import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { formatDate } from "../../utils/date";
import { SkeletonChart } from "../common/Skeleton";

/**
 * Custom tooltip component for displaying price data
 */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold text-white mb-2">
                    {formatDate(new Date(label))}
                </p>
                <div className="text-xs flex justify-between gap-3">
                    <span className="text-gray-300">Prix:</span>
                    <span className="font-semibold text-white">{payload[0].value.toFixed(2)} €</span>
                </div>
                {payload[0].payload.volume && (
                    <div className="text-xs flex justify-between gap-3">
                        <span className="text-gray-300">Volume:</span>
                        <span className="font-semibold text-white">
                            {payload[0].payload.volume.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

/**
 * StockAreaChart displays the historical price data for a single stock as an area chart
 * @param ticker - Stock ticker symbol
 * @param name - Stock name
 * @param historicalData - Historical price data array
 * @param loading - Loading state
 */
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
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h2 className="font-semibold">Prix Historique</h2>
                </div>
                <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            </div>
        );
    }

    // Prepare chart data
    const chartData = historicalData.map((point) => ({
        date: point.Date,
        price: point.Close,
        volume: point.Volume,
    }));

    // Calculate min and max for better scaling
    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const yAxisMin = Math.floor(minPrice - priceRange * 0.1);
    const yAxisMax = Math.ceil(maxPrice + priceRange * 0.1);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">Prix Historique - {name} ({ticker})</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                            const d = new Date(date);
                            return d.getMonth() === 0
                                ? d.getFullYear().toString()
                                : d.toLocaleDateString("fr-FR", { month: "short" });
                        }}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <YAxis
                        domain={[yAxisMin, yAxisMax]}
                        tickFormatter={(v) => `${v.toFixed(0)}€`}
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockAreaChart;
