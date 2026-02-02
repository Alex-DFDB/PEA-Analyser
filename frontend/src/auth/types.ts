/**
 * Authentication type definitions.
 */
export interface User {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    created_at: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}
