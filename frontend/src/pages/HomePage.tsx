// pages/HomePage.tsx
import { Link } from "react-router-dom";
import { BarChart3, Calendar, TrendingUp, Wallet } from "lucide-react";

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <Wallet className="w-20 h-20 text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur PEA Tracker</h1>
                <p className="text-xl text-gray-400">Suivez et analysez votre portefeuille boursier en temps réel</p>
            </div>

            {/* Feature Cards */}
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
                        Visualisez vos positions, performances historiques et projections de croissance
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Suivi en temps réel
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Graphiques de performance
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            Projections futures
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
                        <h2 className="text-2xl font-bold">Dividendes</h2>
                    </div>
                    <p className="text-gray-400">Calendrier complet de vos dividendes et statistiques détaillées</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            Calendrier annuel
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            Historique 10 ans
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                            Rendements moyens
                        </li>
                    </ul>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
