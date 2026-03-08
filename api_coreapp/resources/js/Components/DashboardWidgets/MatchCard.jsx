import React from 'react';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';

export default function MatchCard({ homeTeam, awayTeam, time, status, stadium }) {
    const isLive = status === 'LIVE';

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-[--color-border-subtle] overflow-hidden relative group hover:shadow-premium transition-all duration-300">
            {/* Light Glass Header */}
            <div className={`h-1.5 w-full ${isLive ? 'bg-mx-red' : 'bg-mx-green'} relative overflow-hidden`}>
                {isLive && <div className="absolute inset-0 bg-white/30 animate-pulse"></div>}
            </div>

            <div className="p-8">
                <div className="flex items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">🛡️</div>
                        </div>
                        <span className="text-slate-900 font-black text-xs uppercase tracking-tight text-center leading-tight">
                            {homeTeam}
                        </span>
                    </div>

                    {/* VS / Info Center */}
                    <div className="flex flex-col items-center px-4">
                        {isLive ? (
                            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-200 mb-2 animate-bounce">
                                En Vivo
                            </span>
                        ) : (
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Próximo</span>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="h-px w-6 bg-slate-200"></div>
                            <span className="text-2xl font-black text-slate-900 italic tracking-tighter">VS</span>
                            <div className="h-px w-6 bg-slate-200"></div>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">⚽</div>
                        </div>
                        <span className="text-slate-900 font-black text-xs uppercase tracking-tight text-center leading-tight">
                            {awayTeam}
                        </span>
                    </div>
                </div>

                {/* Match Details Grid */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase whitespace-nowrap">{time.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase whitespace-nowrap">{time.split(' ')[1] || '20:00'}</span>
                    </div>
                </div>
            </div>

            {/* Stadium / Venue Footer */}
            <div className="bg-slate-50/80 backdrop-blur-sm p-4 text-center border-t border-slate-100 flex items-center justify-center gap-3">
                <MapPin size={14} className="text-mx-red" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    {stadium}
                </p>
            </div>
        </div>
    );
}
