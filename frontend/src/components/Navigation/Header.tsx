import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Header component displaying user information and logout button
 * Positioned to the right of the sidebar
 */
const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <header className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-full">
                    <UserIcon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-semibold text-white">{user.username}</h2>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
            </button>
        </header>
    );
};

export default Header;
