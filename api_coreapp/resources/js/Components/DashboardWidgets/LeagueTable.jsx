import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LeagueTable({ teams }) {
    return (
        <div className="bg-white rounded-2xl shadow-soft border border-[--color-border-subtle] overflow-hidden group hover:shadow-premium transition-all duration-500">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Trophy size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tabla de Clasificación</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-white px-2 py-0.5 rounded-full border border-slate-200">Jornada 12</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="text-[10px] uppercase bg-slate-50 text-slate-400 font-black tracking-widest">
                        <tr>
                            <th scope="col" className="px-6 py-4"># Pos</th>
                            <th scope="col" className="px-6 py-4">Club</th>
                            <th scope="col" className="px-6 py-4 text-center">PJ</th>
                            <th scope="col" className="px-6 py-4 text-center">PTS</th>
                            <th scope="col" className="px-6 py-4 text-center">DIF</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teams.map((team, index) => {
                            const isTop = index < 4;
                            const isFirst = index === 0;

                            return (
                                <tr key={index} className="hover:bg-slate-50/80 transition-all group/row">
                                    <td className="px-6 py-4 whitespace-nowrap w-12">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shadow-sm ${isFirst ? 'bg-theme-gradient text-white scale-110 shadow-mx-green/20' :
                                                    isTop ? 'bg-green-100 text-mx-green' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            {index < 2 && <TrendingUp size={12} className="text-green-500" />}
                                            {index > 3 && <TrendingDown size={12} className="text-red-400" />}
                                            {index >= 2 && index <= 3 && <Minus size={12} className="text-slate-300" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-sm shadow-inner group-hover/row:scale-110 transition-transform ${isFirst ? 'bg-white' : 'bg-slate-50'}`}>
                                                🛡️
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-tight">{team.name}</span>
                                                {isFirst && <span className="text-[8px] text-mx-green font-bold uppercase tracking-widest">Lider de Liga</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500 font-bold">{team.played}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-sm font-black ${isFirst ? 'text-mx-green' : 'text-slate-900'}`}>
                                            {team.points}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${team.diff > 0 ? 'bg-green-50 text-green-700' :
                                                team.diff < 0 ? 'bg-red-50 text-red-700' :
                                                    'bg-slate-50 text-slate-400'
                                            }`}>
                                            {team.diff > 0 ? `+${team.diff}` : team.diff}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-mx-green transition-colors">
                    Ver Tabla Completa
                </button>
            </div>
        </div>
    );
}
