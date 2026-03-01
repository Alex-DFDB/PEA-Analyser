import { RefreshCw, Plus } from "lucide-react";

/**
 * PositionsActions provides action buttons for managing positions
 * Includes refresh prices, add position, and import JSON functionality
 */
const PositionsActions = ({
    onRefresh,
    onAdd,
    onImport,
    loading,
    hasPositions,
}: {
    onRefresh: () => void;
    onAdd: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    hasPositions: boolean;
}) => {
    const btnBase: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        border: "1px solid var(--cream-darker)",
        transition: "all 0.15s ease",
    };

    return (
        <div style={{ display: "flex", gap: "8px" }}>
            <button
                onClick={onRefresh}
                disabled={loading || !hasPositions}
                style={{
                    ...btnBase,
                    backgroundColor: loading || !hasPositions ? "var(--cream-dark)" : "white",
                    color: loading || !hasPositions ? "var(--muted)" : "var(--green)",
                    cursor: loading || !hasPositions ? "not-allowed" : "pointer",
                }}
            >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                {loading ? "Actualisation..." : "Actualiser"}
            </button>
            <button
                onClick={onAdd}
                style={{
                    ...btnBase,
                    backgroundColor: "var(--ink)",
                    color: "var(--gold)",
                    borderColor: "var(--ink)",
                }}
            >
                <Plus size={13} /> Ajouter
            </button>
            <label
                style={{
                    ...btnBase,
                    backgroundColor: "white",
                    color: "var(--muted)",
                }}
            >
                <input type="file" accept=".json" onChange={onImport} style={{ display: "none" }} />
                Import JSON
            </label>
        </div>
    );
};

export default PositionsActions;
