/**
 * Skeleton loading component with pulse animation
 * @param className - Optional additional CSS classes
 * @param style - Optional inline styles
 */
const Skeleton = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => {
    return (
        <div className={`animate-pulse rounded ${className}`} style={{ backgroundColor: "var(--cream-darker)", ...style }}></div>
    );
};

/**
 * Skeleton text line
 */
export const SkeletonText = ({ width = "100%", height = "1rem" }: { width?: string; height?: string }) => {
    return <Skeleton className={`h-[${height}]`} style={{ width }} />;
};

/**
 * Skeleton card
 */
export const SkeletonCard = ({ height = "120px" }: { height?: string }) => {
    return (
        <div className="pea-card" style={{ height, padding: "16px" }}>
            <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
            </div>
        </div>
    );
};

/**
 * Skeleton chart
 */
export const SkeletonChart = ({ height = "400px" }: { height?: string }) => {
    return (
        <div className="pea-card" style={{ padding: "16px" }}>
            <div className="mb-4">
                <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="relative" style={{ height }}>
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
};

/**
 * Skeleton table row
 */
export const SkeletonTableRow = () => {
    return (
        <tr style={{ borderTop: "1px solid var(--cream-dark)" }}>
            <td className="py-2"><Skeleton className="h-4 w-16" /></td>
            <td><Skeleton className="h-4 w-12" /></td>
            <td><Skeleton className="h-4 w-16" /></td>
            <td><Skeleton className="h-4 w-16" /></td>
            <td><Skeleton className="h-4 w-20" /></td>
            <td><Skeleton className="h-4 w-24" /></td>
            <td><Skeleton className="h-4 w-8" /></td>
        </tr>
    );
};

/**
 * Skeleton dividend calendar - simplified version
 */
export const SkeletonDividendCalendar = () => {
    return (
        <div className="pea-card" style={{ padding: "16px" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{ backgroundColor: "var(--cream)", borderRadius: "8px", padding: "12px" }}>
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                ))}
            </div>

            {/* Simplified calendar grid placeholder */}
            <div style={{ backgroundColor: "var(--cream)", borderRadius: "8px", padding: "32px", marginBottom: "24px" }}>
                <Skeleton className="h-64 w-full" />
            </div>

            {/* Simplified table */}
            <div style={{ borderTop: "1px solid var(--cream-darker)", paddingTop: "16px" }}>
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
};

export default Skeleton;
