import React from 'react';

export default function MatchCard({ homeTeam, awayTeam, time, status, stadium }) {
    return (
        <div className="bg-[--color-bg-card] rounded-xl shadow-xl border border-gray-700 overflow-hidden relative">
            {/* Status Badge */}
            <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3">
                <span className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-b-lg shadow-md ${status === 'LIVE' ? 'bg-[--color-mx-red] text-[--color-mx-white] animate-pulse' : 'bg-[--color-mx-green] text-[--color-mx-white]'}`}>
                    {status}
                </span>
            </div>

            <div className="p-6 pt-8 flex items-center justify-between">
                {/* Home Team */}
                <div className="flex flex-col items-center w-1/3">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mb-3 flex items-center justify-center text-2xl shadow-inner border-2 border-gray-600">
                        🏠 {/* Placeholder Icon */}
                    </div>
                    <span className="text-[--color-mx-white] font-bold text-center leading-tight">{homeTeam}</span>
                </div>

                {/* VS / Score */}
                <div className="flex flex-col items-center w-1/3 z-10">
                    <span className="text-3xl font-black text-[--color-mx-white] italic">VS</span>
                    <span className="text-gray-400 text-sm mt-1">{time}</span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center w-1/3">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mb-3 flex items-center justify-center text-2xl shadow-inner border-2 border-gray-600">
                        ✈️ {/* Placeholder Icon */}
                    </div>
                    <span className="text-[--color-mx-white] font-bold text-center leading-tight">{awayTeam}</span>
                </div>
            </div>

            {/* Stadium / Footer */}
            <div className="bg-gray-800/50 p-3 text-center border-t border-gray-700">
                <p className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    🏟️ {stadium}
                </p>
            </div>
        </div>
    );
}
