import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner displays a centered loading spinner
 * @param message - Optional message to display below the spinner
 * @param height - Optional height of the container (default: 300px)
 */
const LoadingSpinner = ({ message = "Loading...", height = 300 }: { message?: string; height?: number }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3" style={{ height: `${height}px` }}>
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
