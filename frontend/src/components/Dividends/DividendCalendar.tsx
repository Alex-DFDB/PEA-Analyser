import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Position } from "../../types";
import type { DividendEvent } from "../../hooks/useDividends";
import { formatDate } from "../../utils/date";
import { SkeletonDividendCalendar } from "../common/Skeleton";
import DividendMonthlyBarChart from "../Charts/DividendMonthlyBarChart";

/**
 * Color scheme constants for dividend yield visualization
 * Uses HSL color space to create a gradient from light to dark orange based on yield intensity
 */
const COLOR_CONSTANTS = {
    NO_DIVIDEND: "#1f2937",
    ORANGE_HUE: 25,
    BASE_SATURATION: 70,
    MAX_SATURATION: 100,
    BASE_LIGHTNESS: 65,
    MIN_LIGHTNESS: 30,
    MAX_YIELD_THRESHOLD: 10,
} as const;

const LOCALE = "en-US";
const YEAR_RANGE_LIMIT = 10;

interface DividendSummary {
    ticker: string;
    dividends: Array<{
        date: string;
        amount: number;
        yield?: number;
    }>;
}

interface DividendStateProps {
    dividendData: DividendSummary[];
    loading: boolean;
    error: string | null;
    totalAmount: number;
    totalPayments: number;
    lastPaymentDate: Date | null;
    getEventsByYear: (year: number) => DividendEvent[];
    getYearTotal: (year: number) => number;
}

/**
 * Calculates color intensity based on dividend yield
 * Higher yields result in darker, more saturated orange colors
 * @param totalYield - The total dividend yield percentage
 * @returns HSL color string
 */
const getDividendColor = (totalYield: number): string => {
    if (totalYield === 0) {
        return COLOR_CONSTANTS.NO_DIVIDEND;
    }

    const intensity = Math.min(totalYield / COLOR_CONSTANTS.MAX_YIELD_THRESHOLD, 1);

    const hue = COLOR_CONSTANTS.ORANGE_HUE;
    const saturation = COLOR_CONSTANTS.BASE_SATURATION + intensity * (COLOR_CONSTANTS.MAX_SATURATION - COLOR_CONSTANTS.BASE_SATURATION);
    const lightness = COLOR_CONSTANTS.BASE_LIGHTNESS - intensity * (COLOR_CONSTANTS.BASE_LIGHTNESS - COLOR_CONSTANTS.MIN_LIGHTNESS);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Generates an array of dates for a calendar month, including padding days
 * Calendar starts on Monday (ISO 8601 standard)
 * @param year - The year
 * @param month - The month (0-11)
 * @returns Array of Date objects representing the calendar grid
 */
const getDaysInMonth = (year: number, month: number): Date[] => {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add empty days at the beginning to align the calendar (Monday start)
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
        days.push(new Date(year, month, -i));
    }
    days.reverse();

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

interface MonthCalendarProps {
    year: number;
    month: number;
    events: DividendEvent[];
}

/**
 * MonthCalendar displays a single month with dividend events
 * Days with dividends are colored based on yield intensity
 */
const MonthCalendar = ({ year, month, events }: MonthCalendarProps) => {
    const days = getDaysInMonth(year, month);
    const monthName = new Date(year, month).toLocaleDateString(LOCALE, { month: "long", year: "numeric" });

    // Group events by day for efficient lookup
    const eventsByDay = events.reduce(
        (acc, event) => {
            const key = event.date.toDateString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(event);
            return acc;
        },
        {} as Record<string, DividendEvent[]>,
    );

    return (
        <div className="bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-3 capitalize text-center">{monthName}</h3>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="text-center text-xs text-gray-500 font-medium">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const dayEvents = eventsByDay[day.toDateString()] || [];
                    const totalYield = dayEvents.reduce((sum, e) => sum + (e.yield || 0), 0);

                    return (
                        <div
                            key={i}
                            className={`
                aspect-square rounded flex flex-col items-center justify-center text-xs
                ${isCurrentMonth ? "" : "opacity-30"}
                ${dayEvents.length > 0 ? "cursor-pointer hover:ring-2 ring-orange-400" : ""}
              `}
                            style={{
                                backgroundColor: isCurrentMonth && dayEvents.length > 0 ? getDividendColor(totalYield) : "#1f2937",
                            }}
                            title={
                                dayEvents.length > 0
                                    ? dayEvents
                                          .map((e) => `${e.name}: ${e.yield ? `${e.yield.toFixed(2)}%` : `${e.amount.toFixed(2)}€`}`)
                                          .join("\n")
                                    : ""
                            }
                        >
                            <span className={dayEvents.length > 0 ? "font-bold" : ""}>{day.getDate()}</span>
                            {dayEvents.length > 0 && (
                                <span className="text-[8px] text-orange-200 mt-0.5">
                                    {totalYield > 0 ? `${totalYield.toFixed(1)}%` : "-"}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface DividendCalendarProps {
    positions: Position[];
    dividendState: DividendStateProps;
}

/**
 * DividendCalendar is the main component that displays dividend information
 * Shows a 12-month calendar view with dividend payments colored by yield intensity
 * Includes summary statistics and detailed breakdown by ticker
 */
const DividendCalendar = ({ positions, dividendState }: DividendCalendarProps) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const { dividendData, loading, error, totalAmount, totalPayments, lastPaymentDate, getEventsByYear, getYearTotal } = dividendState;

    if (positions.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Dividend Calendar</h2>
                </div>
                <p className="text-gray-500 text-center py-8">No positions available</p>
            </div>
        );
    }

    if (loading) {
        return <SkeletonDividendCalendar />;
    }

    if (error) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Dividend Calendar</h2>
                </div>
                <p className="text-red-400 text-center py-8">{error}</p>
            </div>
        );
    }

    const yearEvents = getEventsByYear(currentYear);
    const totalAnnual = getYearTotal(currentYear);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Dividend Calendar</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                        <span className="text-gray-400">Total {currentYear}: </span>
                        <span className="text-orange-400 font-bold">€{totalAnnual.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentYear(currentYear - 1)}
                            className="p-1 hover:bg-gray-700 rounded"
                            disabled={currentYear <= new Date().getFullYear() - YEAR_RANGE_LIMIT}
                            aria-label="Previous year"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold min-w-15 text-center">{currentYear}</span>
                        <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            className="p-1 hover:bg-gray-700 rounded"
                            disabled={currentYear >= new Date().getFullYear()}
                            aria-label="Next year"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Total Received (10 Years)</p>
                    <p className="text-lg font-bold text-orange-400">€{totalAmount.toFixed(0)}</p>
                </div>
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Number of Payments</p>
                    <p className="text-lg font-bold text-blue-400">{totalPayments}</p>
                </div>
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Last Payment</p>
                    <p className="text-lg font-bold text-green-400">{lastPaymentDate ? formatDate(lastPaymentDate) : "-"}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                    <MonthCalendar key={i} year={currentYear} month={i} events={yearEvents} />
                ))}
            </div>

            <div className="mt-6">
                <DividendMonthlyBarChart events={yearEvents} year={currentYear} />
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                    <span>Yield Intensity:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-400" style={{ backgroundColor: getDividendColor(0) }} />
                        <span>No payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(2) }} />
                        <span>~2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(4) }} />
                        <span>~4%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(6) }} />
                        <span>~6%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(8) }} />
                        <span>~8%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(10) }} />
                        <span>10%+</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-gray-400 text-left border-b border-gray-700">
                                <th className="pb-2 pr-4">Name</th>
                                <th className="pb-2 pr-4 text-right">Payments</th>
                                <th className="pb-2 pr-4 text-right">First Payment</th>
                                <th className="pb-2 pr-4 text-right">Last Payment</th>
                                <th className="pb-2 text-right">Average Yield</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dividendData.map((div) => {
                                const firstPayment = div.dividends.length > 0 ? new Date(div.dividends[0].date) : null;
                                const lastPayment =
                                    div.dividends.length > 0 ? new Date(div.dividends[div.dividends.length - 1].date) : null;

                                const yieldsWithData = div.dividends.filter((d) => d.yield !== null && d.yield !== undefined);
                                const avgYield =
                                    yieldsWithData.length > 0
                                        ? yieldsWithData.reduce((sum, d) => sum + (d.yield || 0), 0) / yieldsWithData.length
                                        : null;

                                const position = positions.find((p) => p.ticker === div.ticker);
                                return (
                                    <tr key={div.ticker} className="border-b border-gray-700/50">
                                        <td className="py-1 pr-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{position?.name || div.ticker}</span>
                                                <span className="text-[10px] text-gray-400">{div.ticker}</span>
                                            </div>
                                        </td>
                                        <td className="py-1 pr-4 text-right">{div.dividends.length}</td>
                                        <td className="py-1 pr-4 text-right">{firstPayment ? formatDate(firstPayment) : "-"}</td>
                                        <td className="py-1 pr-4 text-right">{lastPayment ? formatDate(lastPayment) : "-"}</td>
                                        <td className="py-1 text-right text-blue-400 font-semibold">
                                            {avgYield !== null ? `${avgYield.toFixed(2)}%` : "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DividendCalendar;
