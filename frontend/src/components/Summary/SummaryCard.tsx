const SummaryCard = ({
    label,
    value,
    delta,
    deltaPositive,
}: {
    label: string;
    value: React.ReactNode;
    delta?: React.ReactNode;
    deltaPositive?: boolean;
}) => {
    return (
        <div
            className="pea-card pea-card-dots"
            style={{ padding: "20px 24px", position: "relative" }}
        >
            <p className="pea-label" style={{ marginBottom: "10px" }}>{label}</p>
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "26px",
                    fontWeight: 500,
                    color: "var(--ink)",
                    lineHeight: 1.2,
                }}
            >
                {value}
            </div>
            {delta !== undefined && (
                <div
                    className={`pea-badge ${deltaPositive ? "pea-badge-green" : "pea-badge-red"}`}
                    style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                    {deltaPositive ? "▲" : "▼"} {delta}
                </div>
            )}
        </div>
    );
};

export default SummaryCard;
