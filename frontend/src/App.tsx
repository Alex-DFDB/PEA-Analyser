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
import { usePositions } from "./hooks/usePositions";
import { useHistoricalData } from "./hooks/useHistoricalData";
import { usePriceUpdate } from "./hooks/usePriceUpdate";
import { useDividends } from "./hooks/useDividends";

/**
 * Main application component with authentication support.
 * Manages global state for portfolio positions, historical data, and dividends.
 * Provides routing between public and protected pages.
 */
function AppContent() {
    const { positions, addPosition, deletePosition, setPositions, loading: positionsLoading } = usePositions();
    const { historicalReturns, historicalData, fetchHistoricalData, loading: historicalLoading } = useHistoricalData();
    const { updatePrices, loading: pricesLoading } = usePriceUpdate(positions, setPositions);
    const dividendState = useDividends(positions, false); // Disable auto-fetch, we'll manage it manually
    const isRefreshingRef = useRef(false);

    // Fetch historical and dividends in parallel when positions change
    useEffect(() => {
        if (positions.length > 0 && !isRefreshingRef.current) {
            const tickers = positions.map((p) => p.ticker);
            // Launch both fetches in parallel
            Promise.all([
                fetchHistoricalData(tickers),
                dividendState.fetchDividends(positions),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions.map(p => p.ticker).sort().join(','), dividendState.fetchDividends]);

    /**
     * Refresh all data in parallel (quotes, historical, dividends)
     */
    const refreshAll = async () => {
        if (positions.length === 0) return;

        const tickers = positions.map((p) => p.ticker);

        // Prevent the useEffect from triggering during manual refresh
        isRefreshingRef.current = true;

        try {
            // Launch all fetches in parallel
            await Promise.all([
                updatePrices(),
                fetchHistoricalData(tickers),
                dividendState.fetchDividends(positions),
            ]);
        } finally {
            isRefreshingRef.current = false;
        }
    };

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/portfolio"
                        element={
                            <div className="min-h-screen bg-gray-900 text-white p-6">
                                <Navbar />
                                <main className="ml-[280px]">
                                    <Header />
                                    <div className="w-full">
                                        <PortfolioPage
                                            positions={positions}
                                            addPosition={addPosition}
                                            deletePosition={deletePosition}
                                            setPositions={setPositions}
                                            updatePrices={refreshAll}
                                            positionsLoading={positionsLoading}
                                            pricesLoading={pricesLoading || historicalLoading || dividendState.loading}
                                            historicalLoading={historicalLoading}
                                            historicalData={historicalData}
                                            historicalReturns={historicalReturns}
                                        />
                                    </div>
                                </main>
                            </div>
                        }
                    />
                    <Route
                        path="/dividends"
                        element={
                            <div className="min-h-screen bg-gray-900 text-white p-6">
                                <Navbar />
                                <main className="ml-[280px]">
                                    <Header />
                                    <div className="w-full">
                                        <DividendsPage positions={positions} dividendState={dividendState} />
                                    </div>
                                </main>
                            </div>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
