// components/Summary/SummaryCard.tsx

const SummaryCard = ({ label, value, trend }: { label: string; value: React.ReactNode; trend?: React.ReactNode }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">{label}</p>
            <div className="flex items-center gap-2">
                {trend}
                {value}
            </div>
        </div>
    );
};

export default SummaryCard;
