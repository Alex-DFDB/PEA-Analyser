// utils/projections.ts
import type { Position } from "../types/index";

/**
 * Calculate Compound Annual Growth Rate (CAGR) from historical price data
 * @param historicalData Array of historical price data with Close prices
 * @returns CAGR as a decimal (e.g., 0.05 for 5% annual growth)
 */
export const calculateHistoricalReturn = (historicalData: any[]) => {
    if (!historicalData || historicalData.length < 2) return 0;

    const startPrice = historicalData[0].Close;
    const endPrice = historicalData[historicalData.length - 1].Close;
    const years = historicalData.length / 12; // Assumes monthly data

    const cagr = Math.pow(endPrice / startPrice, 1 / years) - 1;
    return cagr;
};

/**
 * Calculate portfolio value projections over time
 * @param positions Array of portfolio positions
 * @param historicalReturns Map of ticker symbols to their historical annual returns
 * @param years Number of years to project into the future
 * @param detailed If true, returns per-position breakdown; if false, returns aggregated totals
 * @returns Array of projection data points, either detailed by position or aggregated
 */
export const calculateProjection = (
    positions: Position[],
    historicalReturns: { [ticker: string]: number },
    years: number,
    detailed: boolean = false,
) => {
    if (detailed) {
        const positionsData = positions.map((position) => {
            const data = [];
            let value = (position.currentPrice || position.buyPrice) * position.quantity;
            const annualReturn = historicalReturns[position.ticker] || 0;

            for (let y = 0; y <= years; y++) {
                data.push({
                    year: y,
                    [position.ticker]: value,
                });
                value = value * (1 + annualReturn);
            }
            return data;
        });

        const mergedData = [];
        for (let y = 0; y <= years; y++) {
            const yearData: any = { year: y };
            positionsData.forEach((posData, i) => {
                yearData[positions[i].ticker] = posData[y][positions[i].ticker];
            });
            mergedData.push(yearData);
        }
        return mergedData;
    } else {
        const projectionData = [];
        let positionValuesWithDiv = positions.map((p) => (p.currentPrice || p.buyPrice) * p.quantity);
        let positionValuesWithoutDiv = positions.map((p) => (p.currentPrice || p.buyPrice) * p.quantity);

        let totalWithDiv = positionValuesWithDiv.reduce((sum, val) => sum + val, 0);
        let totalWithoutDiv = positionValuesWithoutDiv.reduce((sum, val) => sum + val, 0);

        for (let y = 0; y <= years; y++) {
            projectionData.push({
                year: y,
                withDividends: totalWithDiv,
                withoutDividends: totalWithoutDiv,
            });

            positionValuesWithDiv = positionValuesWithDiv.map((posValue, i) => {
                const annualReturn = historicalReturns[positions[i].ticker] || 0;
                const annualDividend = (positions[i].dividendYield || 0) / 100;
                return posValue * (1 + annualReturn + annualDividend);
            });

            positionValuesWithoutDiv = positionValuesWithoutDiv.map((posValue, i) => {
                const annualReturn = historicalReturns[positions[i].ticker] || 0;
                return posValue * (1 + annualReturn);
            });

            totalWithDiv = positionValuesWithDiv.reduce((sum, val) => sum + val, 0);
            totalWithoutDiv = positionValuesWithoutDiv.reduce((sum, val) => sum + val, 0);
        }

        return projectionData;
    }
};
