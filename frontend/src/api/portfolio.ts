/**
 * Portfolio API calls.
 */
import { apiClient } from './client';
import type { Position } from '../types';

export interface PositionCreate {
    ticker: string;
    quantity: number;
    buy_price: number;
    color?: string;
}

export interface PositionUpdate {
    quantity?: number;
    buy_price?: number;
    color?: string;
}

export interface BulkImportPosition {
    ticker: string;
    quantity: number;
    buyPrice: number;
    color?: string;
}

/**
 * Get all positions for the current user.
 */
export const getPositions = async (): Promise<Position[]> => {
    const response = await apiClient.get<Position[]>('/portfolio/positions');
    return response.data;
};

/**
 * Create a new position.
 */
export const createPosition = async (data: PositionCreate): Promise<Position> => {
    const response = await apiClient.post<Position>('/portfolio/positions', data);
    return response.data;
};

/**
 * Get a specific position.
 */
export const getPosition = async (id: number): Promise<Position> => {
    const response = await apiClient.get<Position>(`/portfolio/positions/${id}`);
    return response.data;
};

/**
 * Update a position.
 */
export const updatePosition = async (id: number, data: PositionUpdate): Promise<Position> => {
    const response = await apiClient.put<Position>(`/portfolio/positions/${id}`, data);
    return response.data;
};

/**
 * Delete a position.
 */
export const deletePosition = async (id: number): Promise<void> => {
    await apiClient.delete(`/portfolio/positions/${id}`);
};

/**
 * Bulk import positions from JSON.
 */
export const bulkImportPositions = async (positions: BulkImportPosition[]): Promise<Position[]> => {
    const response = await apiClient.post<Position[]>('/portfolio/import', { positions });
    return response.data;
};

/**
 * Export all positions as JSON.
 */
export const exportPositions = async (): Promise<BulkImportPosition[]> => {
    const response = await apiClient.get<BulkImportPosition[]>('/portfolio/export');
    return response.data;
};
