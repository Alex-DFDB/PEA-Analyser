// hooks/usePositions.ts
import { useState } from "react";

import type { Position } from "../types/index";

/**
 * Hook for managing portfolio positions state
 * @returns Object containing positions array and management functions
 */
export function usePositions() {
    const [positions, setPositions] = useState<Position[]>([]);

    /**
     * Add a new position or update an existing one
     * If position with same ticker exists, it will be replaced
     * @param newPosition - Position to add or update
     */
    const addPosition = (newPosition: Position) => {
        const existingIndex = positions.findIndex((p) => p.ticker === newPosition.ticker);
        if (existingIndex >= 0) {
            const updatedPositions = [...positions];
            updatedPositions[existingIndex] = newPosition;
            setPositions(updatedPositions);
        } else {
            setPositions([...positions, newPosition]);
        }
    };

    /**
     * Delete a position by ticker symbol
     * @param ticker - Ticker symbol of position to delete
     */
    const deletePosition = (ticker: string) => {
        setPositions(positions.filter((p) => p.ticker !== ticker));
    };

    return { positions, addPosition, deletePosition, setPositions };
}
