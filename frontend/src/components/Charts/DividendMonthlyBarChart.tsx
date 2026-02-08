import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import type { DividendEvent } from "../../hooks/useDividends";

interface MonthlyData {
    month: string;
    monthIndex: number;
    total: number;
    [ticker: string]: number | string; // Allow dynamic ticker properties
}

interface DividendMonthlyBarChartProps {
    /** Array of dividend events */
    events: DividendEvent[];
    /** Current year to display */
    year: number;
}

/**
 * DividendMonthlyBarChart displays a bar chart summarizing dividend payments by month
 * Shows the total amount received for each month of the selected year
 * Can toggle between total view and per-ticker breakdown view
 */
const DividendMonthlyBarChart = ({ events, year }: DividendMonthlyBarChartProps) => {
    const [showByTicker, setShowByTicker] = useState(false);

    // Month names for display
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    /**
     * Gets all unique tickers from the events
     * @returns Array of ticker symbols
     */
    const getUniqueTickers = (): string[] => {
        const tickers = new Set<string>();
        events
            .filter((e) => e.date.getFullYear() === year)
            .forEach((event) => {
                tickers.add(event.ticker);
            });
        return Array.from(tickers).sort();
    };

    /**
     * Prepares monthly data by aggregating dividend amounts per month
     * @returns Array of monthly totals with month name and amount
     */
    const prepareMonthlyData = (): MonthlyData[] => {
        // Filter events for the selected year
        const yearEvents = events.filter((e) => e.date.getFullYear() === year);

        // Initialize all months with 0
        const monthlyTotals: MonthlyData[] = Array.from({ length: 12 }, (_, i) => ({
            month: monthNames[i],
            monthIndex: i,
            total: 0,
        }));

        if (showByTicker) {
            // Initialize ticker amounts for each month
            const tickers = getUniqueTickers();
            monthlyTotals.forEach((month) => {
                tickers.forEach((ticker) => {
                    month[ticker] = 0;
                });
            });

            // Aggregate dividends by month and ticker
            yearEvents.forEach((event) => {
                const monthIndex = event.date.getMonth();
                monthlyTotals[monthIndex][event.ticker] = (monthlyTotals[monthIndex][event.ticker] as number) + event.amount;
                monthlyTotals[monthIndex].total += event.amount;
            });
        } else {
            // Aggregate dividends by month only
            yearEvents.forEach((event) => {
                const monthIndex = event.date.getMonth();
                monthlyTotals[monthIndex].total += event.amount;
            });
        }

        return monthlyTotals;
    };

    const monthlyData = prepareMonthlyData();
    const maxValue = Math.max(...monthlyData.map((d) => d.total));
    const tickers = getUniqueTickers();

    /**
     * Custom tooltip component for displaying monthly dividend information
     */
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const monthData = payload[0].payload;
            return (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg max-w-xs">
                    <p className="text-sm font-semibold text-white mb-2">
                        {monthData.month} {year}
                    </p>
                    {showByTicker ? (
                        <>
                            {payload
                                .filter((entry: any) => entry.value > 0)
                                .reverse()
                                .map((entry: any, index: number) => (
                                    <div key={index} className="text-xs flex justify-between gap-3 py-0.5">
                                        <span style={{ color: entry.color }}>{entry.name}:</span>
                                        <span className="font-semibold text-white">{entry.value.toFixed(2)}€</span>
                                    </div>
                                ))}
                            <div className="border-t border-gray-600 mt-2 pt-2">
                                <div className="text-sm flex justify-between gap-3">
                                    <span className="text-orange-400 font-semibold">Total:</span>
                                    <span className="text-orange-400 font-semibold">{monthData.total.toFixed(2)}€</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-orange-400">Total: {payload[0].value.toFixed(2)}€</p>
                    )}
                </div>
            );
        }
        return null;
    };

    /**
     * Custom legend component with square rounded icons
     */
    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-400">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    /**
     * Gets bar color based on the value intensity
     * Higher values get darker/more saturated orange colors
     */
    const getBarColor = (value: number) => {
        if (value === 0) return "#374151"; // gray-700
        const intensity = maxValue > 0 ? value / maxValue : 0;
        const hue = 25; // orange hue
        const saturation = 70 + intensity * 30; // 70-100%
        const lightness = 65 - intensity * 35; // 65-30%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    /**
     * Generates a unique color for each ticker
     * Uses HSL color space with varying hues
     */
    const getTickerColor = (index: number, total: number) => {
        const hue = (index * 360) / total;
        const saturation = 65 + (index % 3) * 10; // 65-85%
        const lightness = 50 + (index % 2) * 10; // 50-60%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Monthly Dividend Summary</h2>
                </div>

                {/* Toggle switch for view mode */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Total</span>
                    <button
                        onClick={() => setShowByTicker(!showByTicker)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            showByTicker ? "bg-orange-500" : "bg-gray-600"
                        }`}
                        role="switch"
                        aria-checked={showByTicker}
                        aria-label="Toggle breakdown by ticker"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                showByTicker ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </button>
                    <span className="text-sm text-gray-400">By Ticker</span>
                </div>
            </div>

            {monthlyData.some((d) => d.total > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis tickFormatter={(v) => `${v.toFixed(2)}€`} stroke="#9ca3af" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
                        {showByTicker ? (
                            <>
                                <Legend content={<CustomLegend />} />
                                {tickers.map((ticker, index) => (
                                    <Bar key={ticker} dataKey={ticker} stackId="dividends" fill={getTickerColor(index, tickers.length)} />
                                ))}
                            </>
                        ) : (
                            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                {monthlyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.total)} />
                                ))}
                            </Bar>
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center py-8">No dividend payments for {year}</p>
            )}
        </div>
    );
};

export default DividendMonthlyBarChart;
