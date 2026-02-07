/**
 * Skeleton loading component with pulse animation
 * @param className - Optional additional CSS classes
 */
const Skeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
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

export default Skeleton;
