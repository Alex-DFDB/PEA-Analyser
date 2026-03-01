import { Trash2 } from "lucide-react";

import type { Position } from "../../types";
import { calcPV, calcPVPercent, calcValue } from "../../utils/calculations";

/**
 * PositionRow displays a single position in the positions table
 * Shows ticker, quantity, prices, value, profit/loss, and dividend yield
 * @param position - The position to display
 * @param onDelete - Callback to delete the position
 */
const PositionRow = ({ position, onDelete, totalPortfolioValue }: { position: Position; onDelete: () => void; totalPortfolioValue: number }) => {
    const pv = calcPV(position);
    const pvPct = calcPVPercent(position);
    const value = calcValue(position);
    const weight = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;

    const pvPositive = pv >= 0;
    const tdStyle: React.CSSProperties = {
        padding: "6px 0",
        borderBottom: "1px solid var(--cream-dark)",
        color: "var(--ink-soft)",
        verticalAlign: "middle",
    };

    return (
        <tr>
            <td style={tdStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {position.color && (
                        <span
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: position.color,
                                flexShrink: 0,
                            }}
                        />
                    )}
                    <div>
                        <span style={{ fontWeight: 500, color: "var(--ink)", display: "block" }}>
                            {position.name || position.ticker}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{position.ticker}</span>
                    </div>
                </div>
            </td>
            <td style={tdStyle}>{position.quantity}</td>
            <td style={tdStyle}>{position.buyPrice.toFixed(2)} €</td>
            <td style={tdStyle}>{position.currentPrice.toFixed(2)} €</td>
            <td style={{ ...tdStyle, fontWeight: 500 }}>{value.toFixed(2)} €</td>
            <td style={tdStyle}>
                <span
                    className={`pea-badge ${pvPositive ? "pea-badge-green" : "pea-badge-red"}`}
                >
                    {pvPositive ? "▲" : "▼"} {pvPositive ? "+" : ""}{pv.toFixed(2)} € ({pvPct.toFixed(1)}%)
                </span>
            </td>
            <td style={{ ...tdStyle, width: "100px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ flex: 1, height: "3px", backgroundColor: "var(--cream-darker)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                            style={{
                                height: "100%",
                                width: `${weight}%`,
                                backgroundColor: position.color || "var(--gold)",
                                borderRadius: "2px",
                            }}
                        />
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--muted)", flexShrink: 0, minWidth: "30px", textAlign: "right" }}>
                        {weight.toFixed(1)}%
                    </span>
                </div>
            </td>
            <td style={{ ...tdStyle, textAlign: "right" }}>
                <button
                    onClick={onDelete}
                    title="Supprimer"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--muted)",
                        padding: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--red)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                >
                    <Trash2 size={14} />
                </button>
            </td>
        </tr>
    );
};

export default PositionRow;
