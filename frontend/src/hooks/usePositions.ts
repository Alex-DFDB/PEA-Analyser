// hooks/usePositions.ts
import { useState } from "react";

import type { Position } from "../types/index";

export function usePositions() {
    const [positions, setPositions] = useState<Position[]>([]);

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

    const deletePosition = (ticker: string) => {
        setPositions(positions.filter((p) => p.ticker !== ticker));
    };

    return { positions, addPosition, deletePosition, setPositions };
}
