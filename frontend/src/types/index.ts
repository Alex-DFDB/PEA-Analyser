// types/index.ts
export type Position = {
    ticker: string;
    name: string;
    quantity: number;
    buyPrice: number;
    currentPrice: number;
    dividendYield?: number;
    color?: string; // Nouvelle propriété pour la couleur
};
