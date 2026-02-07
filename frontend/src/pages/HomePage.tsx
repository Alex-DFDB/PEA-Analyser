// pages/HomePage.tsx
import { Link } from "react-router-dom";
import { BarChart3, Calendar, Wallet } from "lucide-react";

/**
 * Home page component displaying welcome message and navigation cards
 * @returns Landing page with links to Portfolio and Dividends sections
 */
const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <Wallet className="w-20 h-20 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to PEA Tracker</h1>
                    <p className="text-xl text-gray-400">Track and analyze your investment portfolio in real-time</p>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Link
                    to="/portfolio"
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Portfolio</h2>
                    </div>
                    <p className="text-gray-400">
                        View your positions, historical performance, and growth projections
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Real-time tracking
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Performance charts
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Future projections
                        </li>
                    </ul>
                </Link>

                <Link
                    to="/dividends"
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-600 rounded-lg">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Dividends</h2>
                    </div>
                    <p className="text-gray-400">Complete calendar of your dividends and detailed statistics</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            Annual calendar
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            10-year history
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            Average yields
                        </li>
                    </ul>
                </Link>
            </div>
            </div>
        </div>
    );
};

export default HomePage;
