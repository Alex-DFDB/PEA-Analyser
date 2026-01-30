// utils/calculations.ts
import type { Position } from "../types/index";

export const calcPV = (p: Position) => ((p.currentPrice || p.buyPrice) - p.buyPrice) * p.quantity;
export const calcPVPercent = (p: Position) => (((p.currentPrice || p.buyPrice) - p.buyPrice) / p.buyPrice) * 100;
export const calcValue = (p: Position) => (p.currentPrice || p.buyPrice) * p.quantity;

export const calculateTotals = (positions: Position[]) => {
    const totalValue = positions.reduce((sum, p) => sum + calcValue(p), 0);
    const totalInvested = positions.reduce((sum, p) => sum + p.buyPrice * p.quantity, 0);
    const totalPV = totalValue - totalInvested;
    const totalPVPercent = totalInvested > 0 ? (totalPV / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, totalPV, totalPVPercent };
};
