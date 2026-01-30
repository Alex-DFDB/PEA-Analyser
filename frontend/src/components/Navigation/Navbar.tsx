// components/Navigation/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { Wallet, BarChart3, Calendar, Home } from "lucide-react";

const Navbar = () => {
    const location = useLocation();

    const navigation = [
        {
            name: "Home",
            path: "/",
            icon: Home,
        },
        {
            name: "Portfolio",
            path: "/portfolio",
            icon: BarChart3,
        },
        {
            name: "Dividendes",
            path: "/dividends",
            icon: Calendar,
        },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Sidebar fixe à gauche avec marge de 6 unités */}
            <aside className="fixed left-6 top-6 bottom-6 w-64 bg-gray-800 rounded-lg z-50 flex flex-col shadow-2xl">
                {/* Header de la sidebar */}
                <div className="flex items-center gap-3 p-6 border-b border-gray-700">
                    <Wallet className="w-8 h-8 text-blue-400" />
                    <h1 className="text-xl font-bold">PEA Tracker</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                            ${
                                                isActive(item.path)
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer de la sidebar */}
                <div className="p-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center">v1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
