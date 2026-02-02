// utils/calculations.ts
import type { Position } from "../types/index";

/**
 * Calculate profit/loss value for a position
 * @param p Position to calculate PV for
 * @returns Profit/loss in currency units
 */
export const calcPV = (p: Position) => ((p.currentPrice || p.buyPrice) - p.buyPrice) * p.quantity;

/**
 * Calculate profit/loss percentage for a position
 * @param p Position to calculate PV percentage for
 * @returns Profit/loss as a percentage
 */
export const calcPVPercent = (p: Position) => (((p.currentPrice || p.buyPrice) - p.buyPrice) / p.buyPrice) * 100;

/**
 * Calculate current value of a position
 * @param p Position to calculate value for
 * @returns Current market value
 */
export const calcValue = (p: Position) => (p.currentPrice || p.buyPrice) * p.quantity;

/**
 * Calculate portfolio totals from all positions
 * @param positions Array of positions in the portfolio
 * @returns Object containing total value, invested amount, P/L value and P/L percentage
 */
export const calculateTotals = (positions: Position[]) => {
    const totalValue = positions.reduce((sum, p) => sum + calcValue(p), 0);
    const totalInvested = positions.reduce((sum, p) => sum + p.buyPrice * p.quantity, 0);
    const totalPV = totalValue - totalInvested;
    const totalPVPercent = totalInvested > 0 ? (totalPV / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, totalPV, totalPVPercent };
};
