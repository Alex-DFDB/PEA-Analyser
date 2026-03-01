// pages/LoginPage.tsx
import { LoginForm } from "../components/Auth/LoginForm";

const LoginPage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div style={{ width: "100%", maxWidth: "420px" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <span style={{ fontSize: "24px", color: "var(--gold)" }}>⊙</span>
                    <h1
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "22px",
                            fontWeight: 500,
                            color: "var(--ink)",
                            margin: "8px 0 4px",
                        }}
                    >
                        PEA·ANALYSER
                    </h1>
                    <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                        Connectez-vous à votre compte
                    </p>
                </div>

                <div className="pea-card" style={{ padding: "32px" }}>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
