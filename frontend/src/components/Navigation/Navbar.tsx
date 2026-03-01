import { Link, useLocation } from "react-router-dom";

const navigation = [
    { name: "Portfolio",  path: "/portfolio", icon: "◈" },
    { name: "Dividendes", path: "/dividends",  icon: "◉" },
    { name: "Analyse",    path: "/analysis",   icon: "◎" },
];

const Navbar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "220px",
                backgroundColor: "var(--ink)",
                backgroundImage: "radial-gradient(var(--gold) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: "28px 24px 24px",
                    borderBottom: "1px solid rgba(196,168,106,0.15)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "var(--gold)", fontSize: "18px" }}>⊙</span>
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "white",
                            letterSpacing: "0.5px",
                        }}
                    >
                        PEA·ANALYSER
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                    {navigation.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "13px",
                                        fontWeight: active ? 500 : 400,
                                        color: active ? "var(--gold)" : "var(--muted)",
                                        backgroundColor: active ? "rgba(196,168,106,0.12)" : "transparent",
                                        transition: "all 0.15s ease",
                                        position: "relative",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,168,106,0.08)";
                                            (e.currentTarget as HTMLElement).style.color = "var(--gold-light)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: "15px", lineHeight: 1 }}>{item.icon}</span>
                                    <span>{item.name}</span>
                                    {active && (
                                        <span
                                            style={{
                                                marginLeft: "auto",
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                backgroundColor: "var(--gold)",
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div
                style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(196,168,106,0.15)",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "rgba(138,128,112,0.6)",
                    }}
                >
                    v1.0.0
                </p>
            </div>
        </aside>
    );
};

export default Navbar;
