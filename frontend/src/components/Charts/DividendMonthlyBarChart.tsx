import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import type { DividendEvent } from "../../hooks/useDividends";

interface MonthlyData {
    month: string;
    monthIndex: number;
    total: number;
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
 */
const DividendMonthlyBarChart = ({ events, year }: DividendMonthlyBarChartProps) => {
    // Month names for display
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    /**
     * Prepares monthly data by aggregating dividend amounts per month
     * @returns Array of monthly totals with month name and amount
     */
    const prepareMonthlyData = (): MonthlyData[] => {
        // Filter events for the selected year
        const yearEvents = events.filter((e) => e.date.getFullYear() === year);

        // Initialize all months with 0
        const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
            month: monthNames[i],
            monthIndex: i,
            total: 0,
        }));

        // Aggregate dividends by month
        yearEvents.forEach((event) => {
            const monthIndex = event.date.getMonth();
            monthlyTotals[monthIndex].total += event.amount;
        });

        return monthlyTotals;
    };

    const monthlyData = prepareMonthlyData();
    const maxValue = Math.max(...monthlyData.map((d) => d.total));

    /**
     * Custom tooltip component for displaying monthly dividend information
     */
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-white">{payload[0].payload.month} {year}</p>
                    <p className="text-sm text-orange-400">
                        Total: €{payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
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

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <h2 className="font-semibold">Monthly Dividend Summary</h2>
            </div>

            {monthlyData.some((d) => d.total > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <YAxis
                            tickFormatter={(v) => `€${v.toFixed(0)}`}
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
                        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                            {monthlyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.total)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center py-8">No dividend payments for {year}</p>
            )}
        </div>
    );
};

export default DividendMonthlyBarChart;
