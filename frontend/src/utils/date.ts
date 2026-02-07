/**
 * Formats a date as DD/MM/YYYY with zero padding
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
