/**
 * Registration form component.
 */
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            await register(email, username, password);
            navigate("/portfolio");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 12px",
        backgroundColor: "var(--cream-dark)",
        border: "1px solid var(--cream-darker)",
        borderRadius: "8px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        color: "var(--ink-soft)",
        outline: "none",
        boxSizing: "border-box",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "6px",
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {error && (
                <div
                    style={{
                        backgroundColor: "rgba(139,58,58,0.08)",
                        border: "1px solid rgba(139,58,58,0.3)",
                        color: "var(--red)",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                    }}
                >
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="Votre adresse email"
                />
            </div>

            <div>
                <label htmlFor="username" style={labelStyle}>Nom d'utilisateur</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={50}
                    style={inputStyle}
                    placeholder="Choisissez un pseudonyme"
                />
            </div>

            <div>
                <label htmlFor="password" style={labelStyle}>Mot de passe</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    style={inputStyle}
                    placeholder="Minimum 8 caractères"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" style={labelStyle}>Confirmer le mot de passe</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="Répétez votre mot de passe"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: loading ? "var(--cream-darker)" : "var(--ink)",
                    color: loading ? "var(--muted)" : "var(--gold)",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "4px",
                }}
            >
                {loading ? "Création en cours..." : "Créer mon compte"}
            </button>

            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                Déjà un compte ?{" "}
                <Link
                    to="/login"
                    style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}
                >
                    Se connecter
                </Link>
            </p>
        </form>
    );
};
