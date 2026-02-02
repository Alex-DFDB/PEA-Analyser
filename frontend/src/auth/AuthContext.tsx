/**
 * Authentication context provider for managing global auth state.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { AuthContextType, User } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const userData = await authApi.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    // Token is invalid, remove it
                    localStorage.removeItem("access_token");
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const tokenResponse = await authApi.login({ username, password });
        localStorage.setItem("access_token", tokenResponse.access_token);

        // Fetch user data
        const userData = await authApi.getCurrentUser();
        setUser(userData);
    };

    const register = async (email: string, username: string, password: string) => {
        const tokenResponse = await authApi.register({ email, username, password });
        localStorage.setItem("access_token", tokenResponse.access_token);

        // Fetch user data
        const userData = await authApi.getCurrentUser();
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore errors, just clear local state
        } finally {
            localStorage.removeItem("access_token");
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
