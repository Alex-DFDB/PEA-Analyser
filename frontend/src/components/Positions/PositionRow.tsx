import { Trash2 } from "lucide-react";

import type { Position } from "../../types";
import { calcPV, calcPVPercent, calcValue } from "../../utils/calculations";

/**
 * PositionRow displays a single position in the positions table
 * Shows ticker, quantity, prices, value, profit/loss, and dividend yield
 * @param position - The position to display
 * @param onDelete - Callback to delete the position
 */
const PositionRow = ({ position, onDelete }: { position: Position; onDelete: () => void }) => {
    const pv = calcPV(position);
    const pvPct = calcPVPercent(position);

    return (
        <tr className="border-t border-gray-700">
            <td className="py-1">
                <div className="flex flex-col">
                    <span className="font-medium">{position.name || position.ticker}</span>
                    <span className="text-xs text-gray-400">{position.ticker}</span>
                </div>
            </td>
            <td>{position.quantity}</td>
            <td>{position.buyPrice.toFixed(2)}€</td>
            <td>{position.currentPrice.toFixed(2)}€</td>
            <td>{calcValue(position).toFixed(2)}€</td>
            <td className={pv >= 0 ? "text-green-400" : "text-red-400"}>
                {pv >= 0 ? "+" : ""}{pv.toFixed(2)}€ ({pvPct.toFixed(1)}%)
            </td>
            <td>
                <button onClick={onDelete} className="text-red-400 hover:text-red-300 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
};

export default PositionRow;
