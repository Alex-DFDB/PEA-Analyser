import { useState } from "react";

/**
 * PositionForm allows users to add new positions to their portfolio
 * Validates required fields before submission
 */
const PositionForm = ({
    onSubmit,
    //onCancel,
    loading,
}: {
    onSubmit: (ticker: string, quantity: number, buyPrice: number, color?: string) => void;
    onCancel: () => void;
    loading: boolean;
}) => {
    const [form, setForm] = useState({
        ticker: "",
        quantity: "",
        buyPrice: "",
        color: "",
    });

    /**
     * Handles form submission after validation
     * Resets form after successful submission
     */
    const handleSubmit = () => {
        if (!form.ticker || !form.quantity || !form.buyPrice) return;

        onSubmit(
            form.ticker.toUpperCase(),
            parseFloat(form.quantity),
            parseFloat(form.buyPrice),
            form.color || undefined,
        );

        setForm({ ticker: "", quantity: "", buyPrice: "", color: "" });
    };

    const inputStyle: React.CSSProperties = {
        backgroundColor: "var(--cream-dark)",
        border: "1px solid var(--cream-darker)",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        color: "var(--ink-soft)",
        outline: "none",
        width: "100%",
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: "var(--cream)",
                borderRadius: "10px",
                border: "1px solid var(--cream-darker)",
            }}
        >
            <input
                placeholder="Ticker (ex: MC.PA)"
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                style={inputStyle}
                disabled={loading}
            />
            <input
                placeholder="Quantité"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                style={inputStyle}
                disabled={loading}
            />
            <input
                placeholder="Prix d'achat (€)"
                type="number"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                style={inputStyle}
                disabled={loading}
            />
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                    type="color"
                    value={form.color || "#C4A86A"}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    style={{ width: "40px", height: "36px", borderRadius: "6px", cursor: "pointer", border: "1px solid var(--cream-darker)" }}
                    disabled={loading}
                    title="Couleur"
                />
                <button
                    onClick={() => setForm({ ...form, color: "" })}
                    style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                    }}
                    disabled={loading}
                >
                    Auto
                </button>
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    gridColumn: "span 4",
                    backgroundColor: loading ? "var(--cream-darker)" : "var(--ink)",
                    color: loading ? "var(--muted)" : "var(--gold)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Ajout en cours..." : "Ajouter la position"}
            </button>
        </div>
    );
};

export default PositionForm;
