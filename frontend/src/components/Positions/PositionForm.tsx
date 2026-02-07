import { useState } from "react";

/**
 * PositionForm allows users to add new positions to their portfolio
 * Validates required fields before submission
 */
const PositionForm = ({
    onSubmit,
    //onCancel,
    loading,
}: {
    onSubmit: (ticker: string, name: string, quantity: number, buyPrice: number, color?: string) => void;
    onCancel: () => void;
    loading: boolean;
}) => {
    const [form, setForm] = useState({
        ticker: "",
        name: "",
        quantity: "",
        buyPrice: "",
        color: "",
    });

    /**
     * Handles form submission after validation
     * Resets form after successful submission
     */
    const handleSubmit = () => {
        if (!form.ticker || !form.quantity || !form.buyPrice) return;

        onSubmit(
            form.ticker.toUpperCase(),
            form.name || form.ticker,
            parseFloat(form.quantity),
            parseFloat(form.buyPrice),
            form.color || undefined,
        );

        setForm({ ticker: "", name: "", quantity: "", buyPrice: "", color: "" });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <input
                placeholder="Ticker"
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                className="bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={loading}
            />
            <input
                placeholder="Name (optional)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={loading}
            />
            <input
                placeholder="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={loading}
            />
            <input
                placeholder="Buy price (€)"
                type="number"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                className="bg-gray-700 rounded px-3 py-2 text-sm"
                disabled={loading}
            />
            <div className="flex gap-2 items-center">
                <input
                    type="color"
                    value={form.color || "#3b82f6"}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-10 h-8 bg-gray-700 rounded cursor-pointer"
                    disabled={loading}
                    title="Color"
                />
                <button
                    onClick={() => setForm({ ...form, color: "" })}
                    className="text-xs text-gray-400 hover:text-white cursor-pointer"
                    disabled={loading}
                >
                    Auto
                </button>
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="col-span-2 md:col-span-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded py-2 text-sm cursor-pointer"
            >
                {loading ? "Adding Position..." : "Add Position"}
            </button>
        </div>
    );
};

export default PositionForm;
