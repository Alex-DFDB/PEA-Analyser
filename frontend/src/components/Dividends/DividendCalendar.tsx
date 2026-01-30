import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Position } from "../../types";
import type { DividendEvent } from "../../hooks/useDividends";

// Fonction pour calculer l'intensité de la couleur orange basée sur le rendement
const getDividendColor = (totalYield: number): string => {
    if (totalYield === 0) {
        return "#1f2937"; // Gris foncé pour pas de dividende
    }

    // Échelle basée sur le rendement en % (ajuster selon vos besoins)
    const intensity = Math.min(totalYield / 10, 1); // Max à 10%

    // Dégradé d'orange du clair au foncé
    const hue = 25; // Orange
    const saturation = 70 + intensity * 30; // 70-100%
    const lightness = 65 - intensity * 35; // 65-30%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Obtenir les jours d'un mois
const getDaysInMonth = (year: number, month: number): Date[] => {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Ajouter les jours vides du début (pour aligner le calendrier)
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
        days.push(new Date(year, month, -i));
    }
    days.reverse();

    // Ajouter tous les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

// Composant calendrier mensuel
const MonthCalendar = ({ year, month, events }: { year: number; month: number; events: DividendEvent[] }) => {
    const days = getDaysInMonth(year, month);
    const monthName = new Date(year, month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    // Grouper les événements par jour
    const eventsByDay = events.reduce(
        (acc, event) => {
            const key = event.date.toDateString();
            if (!acc[key]) acc[key] = [];
            acc[key].push(event);
            return acc;
        },
        {} as Record<string, DividendEvent[]>,
    );

    return (
        <div className="bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-3 capitalize text-center">{monthName}</h3>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                    <div key={i} className="text-center text-xs text-gray-500 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const dayEvents = eventsByDay[day.toDateString()] || [];
                    const totalYield = dayEvents.reduce((sum, e) => sum + (e.yield || 0), 0);

                    return (
                        <div
                            key={i}
                            className={`
                aspect-square rounded flex flex-col items-center justify-center text-xs
                ${isCurrentMonth ? "" : "opacity-30"}
                ${dayEvents.length > 0 ? "cursor-pointer hover:ring-2 ring-orange-400" : ""}
              `}
                            style={{
                                backgroundColor:
                                    isCurrentMonth && dayEvents.length > 0 ? getDividendColor(totalYield) : "#1f2937",
                            }}
                            title={
                                dayEvents.length > 0
                                    ? dayEvents
                                          .map(
                                              (e) =>
                                                  `${e.ticker}: ${e.yield ? `${e.yield.toFixed(2)}%` : `${e.amount.toFixed(2)}€`}`,
                                          )
                                          .join("\n")
                                    : ""
                            }
                        >
                            <span className={dayEvents.length > 0 ? "font-bold" : ""}>{day.getDate()}</span>
                            {dayEvents.length > 0 && (
                                <span className="text-[8px] text-orange-200 mt-0.5">
                                    {totalYield > 0 ? `${totalYield.toFixed(1)}%` : "-"}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Composant principal
const DividendCalendar = ({
    positions,
    dividendState,
}: {
    positions: Position[];
    dividendState: {
        dividendData: any[];
        loading: boolean;
        error: string | null;
        totalAmount: number;
        totalPayments: number;
        lastPaymentDate: Date | null;
        getEventsByYear: (year: number) => any[];
        getYearTotal: (year: number) => number;
    };
}) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const { dividendData, loading, error, totalAmount, totalPayments, lastPaymentDate, getEventsByYear, getYearTotal } =
        dividendState;

    if (positions.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Calendrier des Dividendes</h2>
                </div>
                <p className="text-gray-500 text-center py-8">Aucune position</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Calendrier des Dividendes</h2>
                </div>
                <p className="text-gray-500 text-center py-8">Chargement des données...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Calendrier des Dividendes</h2>
                </div>
                <p className="text-red-400 text-center py-8">{error}</p>
            </div>
        );
    }

    const yearEvents = getEventsByYear(currentYear);
    const totalAnnual = getYearTotal(currentYear);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <h2 className="font-semibold">Calendrier des Dividendes</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                        <span className="text-gray-400">Total {currentYear}: </span>
                        <span className="text-orange-400 font-bold">{totalAnnual.toFixed(2)} €</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentYear(currentYear - 1)}
                            className="p-1 hover:bg-gray-700 rounded"
                            disabled={currentYear <= new Date().getFullYear() - 10}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold min-w-15 text-center">{currentYear}</span>
                        <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            className="p-1 hover:bg-gray-700 rounded"
                            disabled={currentYear >= new Date().getFullYear()}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Total perçu (10 ans)</p>
                    <p className="text-lg font-bold text-orange-400">{totalAmount.toFixed(0)} €</p>
                </div>
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Nombre de paiements</p>
                    <p className="text-lg font-bold text-blue-400">{totalPayments}</p>
                </div>
                <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400">Dernier paiement</p>
                    <p className="text-lg font-bold text-green-400">
                        {lastPaymentDate ? lastPaymentDate.toLocaleDateString("fr-FR") : "-"}
                    </p>
                </div>
            </div>

            {/* Grille des 12 mois */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                    <MonthCalendar key={i} year={currentYear} month={i} events={yearEvents} />
                ))}
            </div>

            {/* Légende et détails */}
            <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                    <span>Intensité du rendement:</span>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded border border-gray-400"
                            style={{ backgroundColor: getDividendColor(0) }}
                        />
                        <span>Pas de paiement</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(2) }} />
                        <span>~2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(4) }} />
                        <span>~4%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(6) }} />
                        <span>~6%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(8) }} />
                        <span>~8%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getDividendColor(10) }} />
                        <span>10%+</span>
                    </div>
                </div>

                {/* Tableau récapitulatif par ticker */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-gray-400 text-left border-b border-gray-700">
                                <th className="pb-2 pr-4">Ticker</th>
                                <th className="pb-2 pr-4 text-right">Paiements</th>
                                <th className="pb-2 pr-4 text-right">Premier paiement</th>
                                <th className="pb-2 pr-4 text-right">Dernier paiement</th>
                                <th className="pb-2 text-right">Rendement moyen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dividendData.map((div) => {
                                const firstPayment = div.dividends.length > 0 ? new Date(div.dividends[0].date) : null;
                                const lastPayment =
                                    div.dividends.length > 0
                                        ? new Date(div.dividends[div.dividends.length - 1].date)
                                        : null;

                                // Calculer le rendement moyen
                                const yieldsWithData = div.dividends.filter(
                                    (d: any) => d.yield !== null && d.yield !== undefined,
                                );
                                const avgYield =
                                    yieldsWithData.length > 0
                                        ? yieldsWithData.reduce((sum: number, d: any) => sum + (d.yield || 0), 0) /
                                          yieldsWithData.length
                                        : null;

                                return (
                                    <tr key={div.ticker} className="border-b border-gray-700/50">
                                        <td className="py-2 pr-4 font-medium">{div.ticker}</td>
                                        <td className="py-2 pr-4 text-right">{div.dividends.length}</td>
                                        <td className="py-2 pr-4 text-right">
                                            {firstPayment ? firstPayment.toLocaleDateString("fr-FR") : "-"}
                                        </td>
                                        <td className="py-2 pr-4 text-right">
                                            {lastPayment ? lastPayment.toLocaleDateString("fr-FR") : "-"}
                                        </td>
                                        <td className="py-2 text-right text-blue-400 font-semibold">
                                            {avgYield !== null ? `${avgYield.toFixed(2)}%` : "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DividendCalendar;
