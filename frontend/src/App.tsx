// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navigation/Navbar";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import DividendsPage from "./pages/DividendsPage";
import { usePositions } from "./hooks/usePositions";
import { useHistoricalData } from "./hooks/useHistoricalData";
import { usePriceUpdate } from "./hooks/usePriceUpdate";
import { useDividends } from "./hooks/useDividends";

/**
 * Main application component
 * Manages global state for portfolio positions, historical data, and dividends
 * Provides routing between home, portfolio, and dividends pages
 */
export default function App() {
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
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <Navbar />

                <main className="ml-[280px]">
                    <div className="w-full">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                                path="/portfolio"
                                element={
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
                                }
                            />
                            <Route
                                path="/dividends"
                                element={<DividendsPage positions={positions} dividendState={dividendState} />}
                            />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}
