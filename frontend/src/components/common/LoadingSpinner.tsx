import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner displays a centered loading spinner
 * @param message - Optional message to display below the spinner
 * @param height - Optional height of the container (default: 300px)
 */
const LoadingSpinner = ({ message = "Chargement...", height = 300 }: { message?: string; height?: number }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3" style={{ height: `${height}px` }}>
            <Loader2 style={{ width: "32px", height: "32px", color: "var(--gold)" }} className="animate-spin" />
            <p style={{ color: "var(--muted)", fontSize: "13px", fontFamily: "'Inter', sans-serif", margin: 0 }}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;
