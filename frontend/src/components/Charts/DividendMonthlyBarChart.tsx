import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import type { DividendEvent } from "../../hooks/useDividends";

interface MonthlyData {
    month: string;
    monthIndex: number;
    total: number;
    [ticker: string]: number | string;
}

interface DividendMonthlyBarChartProps {
    events: DividendEvent[];
    year: number;
    tickerColors?: Record<string, string>;
}

const MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const GOLD_HUE = 38;

const getBarColor = (value: number, maxValue: number): string => {
    if (value === 0) return "var(--cream-darker)";
    const intensity = maxValue > 0 ? value / maxValue : 0;
    const saturation = 45 + intensity * 20;
    const lightness = 80 - intensity * 42;
    return `hsl(${GOLD_HUE}, ${saturation}%, ${lightness}%)`;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const monthData = payload[0].payload;
    return (
        <div
            style={{
                backgroundColor: "white",
                border: "1px solid var(--cream-darker)",
                borderRadius: "10px",
                padding: "10px 14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                maxWidth: "200px",
            }}
        >
            <p
                style={{
                    margin: "0 0 8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--ink)",
                }}
            >
                {monthData.month}
            </p>
            {payload
                .filter((entry: any) => entry.value > 0)
                .reverse()
                .map((entry: any, index: number) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            fontSize: "12px",
                            padding: "2px 0",
                        }}
                    >
                        <span style={{ color: entry.color }}>{entry.name}</span>
                        <span style={{ fontWeight: 600, color: "var(--ink-soft)" }}>{entry.value.toFixed(2)} €</span>
                    </div>
                ))}
            {payload.length > 1 && (
                <div
                    style={{
                        borderTop: "1px solid var(--cream-darker)",
                        marginTop: "6px",
                        paddingTop: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        fontSize: "12px",
                    }}
                >
                    <span style={{ color: "var(--gold)", fontWeight: 600 }}>Total</span>
                    <span style={{ color: "var(--gold)", fontWeight: 600 }}>{monthData.total.toFixed(2)} €</span>
                </div>
            )}
            {payload.length === 1 && (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--gold)" }}>
                    Total : {payload[0].value.toFixed(2)} €
                </p>
            )}
        </div>
    );
};

const CustomLegend = ({ payload }: any) => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "12px" }}>
        {payload.map((entry: any, index: number) => (
            <div key={`legend-${index}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", backgroundColor: entry.color }} />
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>{entry.value}</span>
            </div>
        ))}
    </div>
);

const DividendMonthlyBarChart = ({ events, year, tickerColors = {} }: DividendMonthlyBarChartProps) => {
    const [showByTicker, setShowByTicker] = useState(false);

    const getUniqueTickers = (): string[] => {
        const tickers = new Set<string>();
        events.filter((e) => e.date.getFullYear() === year).forEach((e) => tickers.add(e.ticker));
        return Array.from(tickers).sort();
    };

    const prepareMonthlyData = (): MonthlyData[] => {
        const yearEvents = events.filter((e) => e.date.getFullYear() === year);
        const monthlyTotals: MonthlyData[] = Array.from({ length: 12 }, (_, i) => ({
            month: MONTH_NAMES[i],
            monthIndex: i,
            total: 0,
        }));

        if (showByTicker) {
            const tickers = getUniqueTickers();
            monthlyTotals.forEach((m) => tickers.forEach((t) => (m[t] = 0)));
            yearEvents.forEach((e) => {
                const mi = e.date.getMonth();
                monthlyTotals[mi][e.ticker] = (monthlyTotals[mi][e.ticker] as number) + e.amount;
                monthlyTotals[mi].total += e.amount;
            });
        } else {
            yearEvents.forEach((e) => {
                monthlyTotals[e.date.getMonth()].total += e.amount;
            });
        }

        return monthlyTotals;
    };

    const monthlyData = prepareMonthlyData();
    const maxValue = Math.max(...monthlyData.map((d) => d.total));
    const tickers = getUniqueTickers();
    const hasData = monthlyData.some((d) => d.total > 0);

    return (
        <div className="pea-card" style={{ padding: "20px 24px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={16} style={{ color: "var(--gold)" }} />
                    <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                        Résumé mensuel des dividendes
                    </h2>
                </div>

                {/* Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Total</span>
                    <button
                        onClick={() => setShowByTicker(!showByTicker)}
                        role="switch"
                        aria-checked={showByTicker}
                        aria-label="Afficher par ticker"
                        style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            width: "40px",
                            height: "22px",
                            borderRadius: "11px",
                            backgroundColor: showByTicker ? "var(--ink)" : "var(--cream-darker)",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            padding: 0,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                backgroundColor: showByTicker ? "var(--gold)" : "white",
                                transform: showByTicker ? "translateX(21px)" : "translateX(3px)",
                                transition: "transform 0.2s ease, background-color 0.2s ease",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            }}
                        />
                    </button>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Par ticker</span>
                </div>
            </div>

            {hasData ? (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyData} barCategoryGap="30%">
                        <CartesianGrid
                            strokeDasharray="2 8"
                            stroke="rgba(196,168,106,0.3)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#8A8070", fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(v) => `${v.toFixed(0)} €`}
                            tick={{ fill: "#8A8070", fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                            axisLine={false}
                            tickLine={false}
                            width={52}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(196,168,106,0.08)" }} />
                        {showByTicker ? (
                            <>
                                <Legend content={<CustomLegend />} />
                                {tickers.map((ticker, index) => (
                                    <Bar
                                        key={ticker}
                                        dataKey={ticker}
                                        stackId="dividends"
                                        fill={tickerColors[ticker] || `hsl(${(GOLD_HUE + index * 40) % 360}, 55%, 55%)`}
                                        radius={index === tickers.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                    />
                                ))}
                            </>
                        ) : (
                            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                {monthlyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.total, maxValue)} />
                                ))}
                            </Bar>
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p style={{ color: "var(--muted)", textAlign: "center", padding: "32px 0", fontSize: "13px", margin: 0 }}>
                    Aucun dividende pour {year}.
                </p>
            )}
        </div>
    );
};

export default DividendMonthlyBarChart;
