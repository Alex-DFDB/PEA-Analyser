// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Navbar from "./components/Navigation/Navbar";
import Header from "./components/Navigation/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PortfolioPage from "./pages/PortfolioPage";
import DividendsPage from "./pages/DividendsPage";
import StockAnalysisPage from "./pages/StockAnalysisPage";
import { usePositions } from "./hooks/usePositions";
import { useHistoricalData } from "./hooks/useHistoricalData";
import { usePriceUpdate } from "./hooks/usePriceUpdate";
import { useDividends } from "./hooks/useDividends";

/**
 * Ne monte QUE lorsque ProtectedRoute a validé l'auth.
 * Les hooks API ne s'exécutent donc jamais sur les pages publiques,
 * ce qui évite la boucle 401 → refresh → 401.
 */
function AuthenticatedApp() {
    const { positions, addPosition, deletePosition, setPositions, loading: positionsLoading } = usePositions();
    const { historicalReturns, historicalData, fetchHistoricalData, loading: historicalLoading } = useHistoricalData();
    const { updatePrices, loading: pricesLoading } = usePriceUpdate(positions, setPositions);
    const dividendState = useDividends(positions, false);
    const isRefreshingRef = useRef(false);

    useEffect(() => {
        if (positions.length > 0 && !isRefreshingRef.current) {
            const tickers = positions.map((p) => p.ticker);
            Promise.all([
                fetchHistoricalData(tickers),
                dividendState.fetchDividends(positions),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions.map(p => p.ticker).sort().join(','), dividendState.fetchDividends]);

    const refreshAll = async () => {
        if (positions.length === 0) return;
        const tickers = positions.map((p) => p.ticker);
        isRefreshingRef.current = true;
        try {
            await Promise.all([
                updatePrices(),
                fetchHistoricalData(tickers),
                dividendState.fetchDividends(positions),
            ]);
        } finally {
            isRefreshingRef.current = false;
        }
    };

    const layout = (content: React.ReactNode) => (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <main style={{ marginLeft: "220px", padding: "36px 40px" }}>
                <Header />
                {content}
            </main>
        </div>
    );

    return (
        <Routes>
            <Route
                path="/portfolio"
                element={layout(
                    <PortfolioPage
                        positions={positions}
                        addPosition={addPosition}
                        deletePosition={deletePosition}
                        setPositions={setPositions}
                        updatePrices={refreshAll}
                        positionsLoading={positionsLoading}
                        pricesLoading={pricesLoading || historicalLoading || dividendState.loading}
                        historicalLoading={historicalLoading}
                        historicalReturns={historicalReturns}
                    />
                )}
            />
            <Route
                path="/dividends"
                element={layout(
                    <DividendsPage positions={positions} dividendState={dividendState} />
                )}
            />
            <Route
                path="/analysis"
                element={layout(
                    <StockAnalysisPage
                        positions={positions}
                        historicalData={historicalData}
                        historicalLoading={historicalLoading}
                        dividendState={dividendState}
                    />
                )}
            />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes publiques — aucun hook API */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Routes protégées — AuthenticatedApp (et ses hooks) ne monte que si auth valide */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/*" element={<AuthenticatedApp />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
