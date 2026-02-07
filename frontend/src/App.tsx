// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
    const { positions, addPosition, deletePosition, setPositions } = usePositions();
    const { historicalReturns, historicalData, fetchHistoricalData } = useHistoricalData();
    const { updatePrices, loading } = usePriceUpdate(positions, setPositions, fetchHistoricalData);
    const dividendState = useDividends(positions);

    useEffect(() => {
        if (positions.length > 0) {
            const tickers = positions.map((p) => p.ticker);
            fetchHistoricalData(tickers);
        }
    }, [positions.length]);

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
                                            updatePrices={updatePrices}
                                            loading={loading}
                                            fetchHistoricalData={fetchHistoricalData}
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
