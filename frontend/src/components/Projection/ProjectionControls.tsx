// components/Projection/ProjectionControls.tsx

const ProjectionControls = ({
    years,
    onYearsChange,
    detailedView,
    onViewToggle,
    hasData,
}: {
    years: number;
    onYearsChange: (years: number) => void;
    detailedView: boolean;
    onViewToggle: () => void;
    hasData: boolean;
}) => {
    return (
        <div className="flex gap-4 text-sm items-center">
            <label className="flex items-center gap-2">
                <span className="text-gray-400">Années:</span>
                <input
                    type="number"
                    value={years}
                    onChange={(e) => onYearsChange(Number(e.target.value))}
                    className="bg-gray-700 rounded px-2 py-1 w-16"
                    min={1}
                    max={30}
                />
            </label>
            <div className="text-gray-400 text-xs">
                {hasData ? "Basé sur 5 ans d'historique" : "Cliquez sur Actualiser"}
            </div>
            <button
                onClick={onViewToggle}
                className={`px-3 py-1 rounded text-sm ${detailedView ? "bg-blue-600" : "bg-gray-600"} hover:opacity-80`}
            >
                {detailedView ? "Vue détaillée" : "Vue totale"}
            </button>
        </div>
    );
};

export default ProjectionControls;
