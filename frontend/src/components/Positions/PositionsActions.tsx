import { RefreshCw, Plus } from "lucide-react";

/**
 * PositionsActions provides action buttons for managing positions
 * Includes refresh prices, add position, and import JSON functionality
 */
const PositionsActions = ({
    onRefresh,
    onAdd,
    onImport,
    loading,
    hasPositions,
}: {
    onRefresh: () => void;
    onAdd: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    hasPositions: boolean;
}) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={onRefresh}
                disabled={loading || !hasPositions}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1.5 rounded text-sm cursor-pointer"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Refreshing..." : "Refresh Prices"}
            </button>
            <button
                onClick={onAdd}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm cursor-pointer"
            >
                <Plus className="w-4 h-4" /> Add
            </button>
            <label className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm cursor-pointer">
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
                Import JSON
            </label>
        </div>
    );
};

export default PositionsActions;
