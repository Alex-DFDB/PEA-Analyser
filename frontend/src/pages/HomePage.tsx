// pages/HomePage.tsx
import { Link } from "react-router-dom";

interface NavCard {
    to: string;
    icon: string;
    title: string;
    description: string;
    items: string[];
}

const cards: NavCard[] = [
    {
        to: "/portfolio",
        icon: "◈",
        title: "Portfolio",
        description: "Positions, performance historique et projections de croissance.",
        items: ["Suivi en temps réel", "Graphes de performance", "Projections futures"],
    },
    {
        to: "/dividends",
        icon: "◉",
        title: "Dividendes",
        description: "Calendrier complet de vos dividendes et statistiques détaillées.",
        items: ["Calendrier annuel", "Historique 10 ans", "Rendements moyens"],
    },
    {
        to: "/analysis",
        icon: "◎",
        title: "Analyse",
        description: "Analyse détaillée par action — cours, évolution, métriques.",
        items: ["Cours historique", "Range 52 semaines", "Métriques avancées"],
    },
];

const HomePage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
            }}
        >
            <div style={{ width: "100%", maxWidth: "860px" }}>
                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "24px",
                        }}
                    >
                        <span style={{ fontSize: "32px", color: "var(--gold)" }}>⊙</span>
                        <h1
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "36px",
                                fontWeight: 500,
                                color: "var(--ink)",
                                margin: 0,
                                letterSpacing: "0.5px",
                            }}
                        >
                            PEA·ANALYSER
                        </h1>
                    </div>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "var(--muted)",
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        Analysez et suivez votre portefeuille PEA en temps réel.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
                    {cards.map((card) => (
                        <Link
                            key={card.to}
                            to={card.to}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                className="pea-card"
                                style={{
                                    padding: "28px 24px",
                                    cursor: "pointer",
                                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "var(--gold)";
                                    el.style.boxShadow = "0 4px 16px rgba(196,168,106,0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "var(--cream-darker)";
                                    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                                }}
                            >
                                {/* Icon */}
                                <div style={{ marginBottom: "16px" }}>
                                    <span
                                        style={{
                                            fontSize: "22px",
                                            color: "var(--gold)",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {card.icon}
                                    </span>
                                </div>

                                <h2
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "18px",
                                        fontWeight: 500,
                                        color: "var(--ink)",
                                        margin: "0 0 8px",
                                    }}
                                >
                                    {card.title}
                                </h2>

                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--muted)",
                                        margin: "0 0 16px",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {card.description}
                                </p>

                                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {card.items.map((item) => (
                                        <li
                                            key={item}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                fontSize: "12px",
                                                color: "var(--ink-soft)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: "5px",
                                                    height: "5px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "var(--gold)",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Auth links */}
                <div style={{ textAlign: "center" }}>
                    <Link
                        to="/login"
                        style={{
                            display: "inline-block",
                            padding: "10px 28px",
                            backgroundColor: "var(--ink)",
                            color: "var(--gold)",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 500,
                            marginRight: "12px",
                        }}
                    >
                        Se connecter
                    </Link>
                    <Link
                        to="/register"
                        style={{
                            display: "inline-block",
                            padding: "10px 28px",
                            backgroundColor: "transparent",
                            color: "var(--muted)",
                            border: "1px solid var(--cream-darker)",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 500,
                        }}
                    >
                        Créer un compte
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
