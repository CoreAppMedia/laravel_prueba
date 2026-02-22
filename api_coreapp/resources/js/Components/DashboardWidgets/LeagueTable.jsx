import React from 'react';

export default function LeagueTable({ teams }) {
    return (
        <div className="bg-[--color-bg-card] rounded-xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[--color-mx-white] uppercase tracking-wider">Tabla General</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-[--color-bg-dark] text-gray-400 font-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3 tracking-wider">#</th>
                            <th scope="col" className="px-6 py-3 tracking-wider">Equipo</th>
                            <th scope="col" className="px-6 py-3 tracking-wider text-center">PJ</th>
                            <th scope="col" className="px-6 py-3 tracking-wider text-center">PTS</th>
                            <th scope="col" className="px-6 py-3 tracking-wider text-center">DIF</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {teams.map((team, index) => (
                            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-[--color-mx-white] whitespace-nowrap w-12">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 3 ? 'bg-[--color-mx-green] text-[--color-mx-white] shadow-sm' : 'bg-gray-700 text-gray-300'}`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-[--color-mx-white] whitespace-nowrap flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
                                        🛡️ {/* Validar si hay logo, sino placeholder */}
                                    </div>
                                    {team.name}
                                </td>
                                <td className="px-6 py-4 text-center text-gray-300">{team.played}</td>
                                <td className="px-6 py-4 text-center font-bold text-[--color-mx-white] text-lg">{team.points}</td>
                                <td className={`px-6 py-4 text-center font-bold ${team.diff > 0 ? 'text-[--color-mx-green]' : team.diff < 0 ? 'text-[--color-mx-red]' : 'text-gray-400'}`}>
                                    {team.diff > 0 ? `+${team.diff}` : team.diff}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
