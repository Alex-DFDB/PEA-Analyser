const ProjectionControls = ({
    years,
    onYearsChange,
    detailedView,
    onViewToggle,
    hasData,
}: {
    years: number;
    onYearsChange: (years: number) => void;
    detailedView: boolean;
    onViewToggle: () => void;
    hasData: boolean;
}) => {
    return (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="pea-label">Années</span>
                <input
                    type="number"
                    value={years}
                    onChange={(e) => onYearsChange(Number(e.target.value))}
                    min={1}
                    max={30}
                    style={{
                        backgroundColor: "var(--cream-dark)",
                        border: "1px solid var(--cream-darker)",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        width: "56px",
                        fontSize: "13px",
                        color: "var(--ink)",
                        outline: "none",
                    }}
                />
            </label>
            {!hasData && (
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    Cliquez sur « Actualiser » pour charger les données
                </span>
            )}
            <button
                onClick={onViewToggle}
                style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "1px solid var(--cream-darker)",
                    backgroundColor: detailedView ? "var(--ink)" : "white",
                    color: detailedView ? "var(--gold)" : "var(--muted)",
                    transition: "all 0.15s ease",
                }}
            >
                {detailedView ? "Vue détaillée" : "Vue totale"}
            </button>
        </div>
    );
};

export default ProjectionControls;
