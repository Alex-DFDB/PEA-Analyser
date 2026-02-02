/**
 * Authentication API calls.
 */
import { apiClient } from './client';

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface LoginData {
    username: string; // Can be email or username
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface User {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
    created_at: string;
}

/**
 * Register a new user account.
 */
export const register = async (data: RegisterData): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/register', data);
    return response.data;
};

/**
 * Login with username/email and password.
 */
export const login = async (data: LoginData): Promise<TokenResponse> => {
    // OAuth2 password flow expects form data
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data;
};

/**
 * Logout current user.
 */
export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

/**
 * Get current user information.
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
};
