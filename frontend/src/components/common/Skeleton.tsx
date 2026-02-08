/**
 * Skeleton loading component with pulse animation
 * @param className - Optional additional CSS classes
 * @param style - Optional inline styles
 */
const Skeleton = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => {
    return (
        <div className={`animate-pulse bg-gray-700 rounded ${className}`} style={style}></div>
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
        <div className="bg-gray-800 rounded-lg p-4" style={{ height }}>
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
        <div className="bg-gray-800 rounded-lg p-4">
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
        <tr className="border-t border-gray-700">
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
        <div className="bg-gray-800 rounded-lg p-4">
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
                    <div key={i} className="bg-gray-700/50 rounded p-3">
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                ))}
            </div>

            {/* Simplified calendar grid placeholder */}
            <div className="bg-gray-700/30 rounded-lg p-8 mb-6">
                <Skeleton className="h-64 w-full" />
            </div>

            {/* Simplified table */}
            <div className="border-t border-gray-700 pt-4">
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
};

export default Skeleton;
