// utils/colors.ts

/**
 * Preset color palette for chart visualizations
 * Provides 8 distinct, accessible colors for positions
 */
export const PRESET_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

/**
 * Generate a random HSL color with controlled saturation and lightness
 * Ensures colors are vibrant and visible on dark backgrounds
 * @returns Random color in HSL format
 */
export const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 30; // 60-90%
    const lightness = 45 + Math.random() * 15; // 45-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Get appropriate color for a position
 * Priority: position's assigned color > preset color by index > random color
 * @param position - Position object that may have a color property
 * @param index - Index of position in array (for preset color selection)
 * @returns Hex or HSL color string
 */
export const getPositionColor = (position: { color?: string }, index: number): string => {
    if (position.color) {
        return position.color;
    }

    if (index < PRESET_COLORS.length) {
        return PRESET_COLORS[index];
    }

    return generateRandomColor();
};
