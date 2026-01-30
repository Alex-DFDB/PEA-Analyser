// utils/colors.ts
export const PRESET_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 30;
    const lightness = 45 + Math.random() * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getPositionColor = (position: { color?: string }, index: number): string => {
    if (position.color) {
        return position.color;
    }

    if (index < PRESET_COLORS.length) {
        return PRESET_COLORS[index];
    }

    return generateRandomColor();
};
