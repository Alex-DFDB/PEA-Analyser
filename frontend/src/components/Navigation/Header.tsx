import { LogOut } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
            }}
        >
            <div>
                <p className="pea-label" style={{ marginBottom: "4px" }}>Portefeuille PEA</p>
                <h1
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "28px",
                        fontWeight: 500,
                        color: "var(--ink)",
                        margin: 0,
                    }}
                >
                    {user.username}
                </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "right" }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "var(--ink-soft)",
                            fontWeight: 500,
                        }}
                    >
                        {user.username}
                    </p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "var(--muted)",
                        }}
                    >
                        {user.email}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    title="Se déconnecter"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        backgroundColor: "transparent",
                        border: "1px solid var(--cream-darker)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--muted)",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--red)";
                        (e.currentTarget as HTMLElement).style.color = "var(--red)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--cream-darker)";
                        (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                    }}
                >
                    <LogOut size={13} />
                    Déconnexion
                </button>
            </div>
        </header>
    );
};

export default Header;
