import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Position } from "../../types";
import type { DividendEvent } from "../../hooks/useDividends";
import { formatDate } from "../../utils/date";
import { SkeletonDividendCalendar } from "../common/Skeleton";
import DividendMonthlyBarChart from "../Charts/DividendMonthlyBarChart";

/**
 * Color scheme for dividend yield visualization.
 * Uses gold-family HSL colors aligned with the design system.
 */
const COLOR_CONSTANTS = {
    NO_DIVIDEND: "transparent",
    GOLD_HUE: 38,
    BASE_SATURATION: 45,
    MAX_SATURATION: 65,
    BASE_LIGHTNESS: 82,
    MIN_LIGHTNESS: 38,
    MAX_YIELD_THRESHOLD: 10,
} as const;

const LOCALE = "fr-FR";
const YEAR_RANGE_LIMIT = 10;
const DAY_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

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
 * Calculates gold-tinted color based on dividend yield intensity.
 */
const getDividendColor = (totalYield: number): string => {
    if (totalYield === 0) return COLOR_CONSTANTS.NO_DIVIDEND;

    const intensity = Math.min(totalYield / COLOR_CONSTANTS.MAX_YIELD_THRESHOLD, 1);
    const saturation = COLOR_CONSTANTS.BASE_SATURATION + intensity * (COLOR_CONSTANTS.MAX_SATURATION - COLOR_CONSTANTS.BASE_SATURATION);
    const lightness = COLOR_CONSTANTS.BASE_LIGHTNESS - intensity * (COLOR_CONSTANTS.BASE_LIGHTNESS - COLOR_CONSTANTS.MIN_LIGHTNESS);

    return `hsl(${COLOR_CONSTANTS.GOLD_HUE}, ${saturation}%, ${lightness}%)`;
};

/**
 * Generates an array of dates for a calendar month, including padding days.
 * Calendar starts on Monday (ISO 8601).
 */
const getDaysInMonth = (year: number, month: number): Date[] => {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
        days.push(new Date(year, month, -i));
    }
    days.reverse();

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

const MonthCalendar = ({ year, month, events }: MonthCalendarProps) => {
    const days = getDaysInMonth(year, month);
    const monthName = new Date(year, month).toLocaleDateString(LOCALE, { month: "long", year: "numeric" });

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
        <div
            style={{
                backgroundColor: "var(--cream)",
                borderRadius: "10px",
                border: "1px solid var(--cream-darker)",
                padding: "12px",
            }}
        >
            <h3
                style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    textTransform: "capitalize",
                    textAlign: "center",
                    color: "var(--ink)",
                    margin: "0 0 10px",
                }}
            >
                {monthName}
            </h3>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_HEADERS.map((day, i) => (
                    <div
                        key={i}
                        style={{
                            textAlign: "center",
                            fontSize: "9px",
                            color: "var(--muted)",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                        }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const dayEvents = eventsByDay[day.toDateString()] || [];
                    const totalYield = dayEvents.reduce((sum, e) => sum + (e.yield || 0), 0);
                    const hasDividend = isCurrentMonth && dayEvents.length > 0;
                    const bgColor = hasDividend ? getDividendColor(totalYield) : isCurrentMonth ? "var(--cream-darker)" : "transparent";
                    const textColor = hasDividend && totalYield >= 5 ? "white" : "var(--ink-soft)";

                    return (
                        <div
                            key={i}
                            className="aspect-square rounded flex flex-col items-center justify-center"
                            style={{
                                backgroundColor: bgColor,
                                opacity: isCurrentMonth ? 1 : 0.25,
                                cursor: hasDividend ? "pointer" : "default",
                                fontSize: "10px",
                                color: textColor,
                            }}
                            title={
                                dayEvents.length > 0
                                    ? dayEvents
                                          .map((e) => `${e.name}: ${e.yield ? `${e.yield.toFixed(2)}%` : `${e.amount.toFixed(2)} €`}`)
                                          .join("\n")
                                    : ""
                            }
                        >
                            <span style={{ fontWeight: hasDividend ? 600 : 400 }}>{day.getDate()}</span>
                            {hasDividend && (
                                <span style={{ fontSize: "7px", opacity: 0.9, lineHeight: 1 }}>
                                    {totalYield > 0 ? `${totalYield.toFixed(1)}%` : "·"}
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

const DividendCalendar = ({ positions, dividendState }: DividendCalendarProps) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const { dividendData, loading, error, totalAmount, totalPayments, lastPaymentDate, getEventsByYear, getYearTotal } = dividendState;

    const headerContent = (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Calendar size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                Calendrier des Dividendes
            </h2>
        </div>
    );

    if (positions.length === 0) {
        return (
            <div className="pea-card" style={{ padding: "24px" }}>
                {headerContent}
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0", fontSize: "13px", margin: 0 }}>
                    Aucune position dans votre portefeuille.
                </p>
            </div>
        );
    }

    if (loading) return <SkeletonDividendCalendar />;

    if (error) {
        return (
            <div className="pea-card" style={{ padding: "24px" }}>
                {headerContent}
                <p style={{ color: "var(--red)", textAlign: "center", padding: "32px 0", fontSize: "13px", margin: 0 }}>
                    {error}
                </p>
            </div>
        );
    }

    const yearEvents = getEventsByYear(currentYear);
    const totalAnnual = getYearTotal(currentYear);
    const navBtnStyle: React.CSSProperties = {
        padding: "4px 6px",
        backgroundColor: "transparent",
        border: "1px solid var(--cream-darker)",
        borderRadius: "6px",
        cursor: "pointer",
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
    };

    return (
        <div className="pea-card" style={{ padding: "24px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                        Calendrier des Dividendes
                    </h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            fontSize: "12px",
                            backgroundColor: "var(--cream)",
                            border: "1px solid var(--cream-darker)",
                            borderRadius: "8px",
                            padding: "4px 12px",
                        }}
                    >
                        <span style={{ color: "var(--muted)" }}>Total {currentYear} : </span>
                        <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                            {totalAnnual.toFixed(2)} €
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button
                            onClick={() => setCurrentYear(currentYear - 1)}
                            disabled={currentYear <= new Date().getFullYear() - YEAR_RANGE_LIMIT}
                            aria-label="Année précédente"
                            style={navBtnStyle}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                minWidth: "48px",
                                textAlign: "center",
                                color: "var(--ink)",
                            }}
                        >
                            {currentYear}
                        </span>
                        <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            disabled={currentYear >= new Date().getFullYear()}
                            aria-label="Année suivante"
                            style={navBtnStyle}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary KPI cards */}
            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: "24px" }}>
                {[
                    { label: "Total reçu (10 ans)", value: `${totalAmount.toFixed(2)} €`, color: "var(--gold)" },
                    { label: "Nombre de versements", value: String(totalPayments), color: "var(--ink)" },
                    { label: "Dernier versement", value: lastPaymentDate ? formatDate(lastPaymentDate) : "—", color: "var(--green)" },
                ].map(({ label, value, color }) => (
                    <div
                        key={label}
                        style={{
                            backgroundColor: "var(--cream)",
                            borderRadius: "10px",
                            padding: "14px 16px",
                            border: "1px solid var(--cream-darker)",
                        }}
                    >
                        <p className="pea-label" style={{ marginBottom: "8px" }}>{label}</p>
                        <p style={{ margin: 0, fontSize: "18px", fontWeight: 500, color }}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* 12-month calendar grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => (
                    <MonthCalendar key={i} year={currentYear} month={i} events={yearEvents} />
                ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                <span className="pea-label">Intensité du rendement :</span>
                {[0, 2, 4, 6, 8, 10].map((yld) => (
                    <div key={yld} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div
                            style={{
                                width: "14px",
                                height: "14px",
                                borderRadius: "4px",
                                backgroundColor: yld === 0 ? "var(--cream-darker)" : getDividendColor(yld),
                            }}
                        />
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {yld === 0 ? "Aucun" : `~${yld}%`}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div style={{ marginTop: "24px" }}>
                <DividendMonthlyBarChart
                    events={yearEvents}
                    year={currentYear}
                    tickerColors={Object.fromEntries(positions.map((p) => [p.ticker, p.color || "var(--gold)"]))}
                />
            </div>

            {/* Breakdown table */}
            <div style={{ marginTop: "20px", borderTop: "1px solid var(--cream-darker)", paddingTop: "20px" }}>
                {/* Breakdown table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Valeur", "Versements", "Premier versement", "Dernier versement", "Rendement moyen"].map((h, i) => (
                                    <th
                                        key={h}
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: 500,
                                            letterSpacing: "1px",
                                            textTransform: "uppercase",
                                            color: "var(--muted)",
                                            textAlign: i === 0 ? "left" : "right",
                                            paddingBottom: "10px",
                                            paddingRight: i < 4 ? "12px" : "0",
                                            borderBottom: "1px solid var(--cream-darker)",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dividendData.map((div) => {
                                const firstPayment = div.dividends.length > 0 ? new Date(div.dividends[0].date) : null;
                                const lastPayment = div.dividends.length > 0 ? new Date(div.dividends[div.dividends.length - 1].date) : null;
                                const yieldsWithData = div.dividends.filter((d) => d.yield !== null && d.yield !== undefined);
                                const avgYield =
                                    yieldsWithData.length > 0
                                        ? yieldsWithData.reduce((sum, d) => sum + (d.yield || 0), 0) / yieldsWithData.length
                                        : null;
                                const position = positions.find((p) => p.ticker === div.ticker);
                                const tdStyle: React.CSSProperties = {
                                    padding: "10px 12px 10px 0",
                                    borderBottom: "1px solid var(--cream-dark)",
                                    color: "var(--ink-soft)",
                                    verticalAlign: "middle",
                                };

                                return (
                                    <tr key={div.ticker}>
                                        <td style={tdStyle}>
                                            <span style={{ fontWeight: 500, color: "var(--ink)", display: "block" }}>
                                                {position?.name || div.ticker}
                                            </span>
                                            <span style={{ fontSize: "10px", color: "var(--muted)" }}>{div.ticker}</span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: "right" }}>{div.dividends.length}</td>
                                        <td style={{ ...tdStyle, textAlign: "right" }}>{firstPayment ? formatDate(firstPayment) : "—"}</td>
                                        <td style={{ ...tdStyle, textAlign: "right" }}>{lastPayment ? formatDate(lastPayment) : "—"}</td>
                                        <td style={{ ...tdStyle, textAlign: "right", paddingRight: 0 }}>
                                            {avgYield !== null ? (
                                                <span className="pea-badge pea-badge-green">{avgYield.toFixed(2)}%</span>
                                            ) : (
                                                <span style={{ color: "var(--muted)" }}>—</span>
                                            )}
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
