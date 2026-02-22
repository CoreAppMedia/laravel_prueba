import React from 'react';

export default function StatsCard({ title, value, icon, color, href }) {
    const colorClasses = {
        green: 'bg-[--color-mx-green]',
        red: 'bg-[--color-mx-red]',
        white: 'bg-[--color-mx-dark]',
        default: 'bg-[--color-bg-card]'
    };

    const selectedColor = colorClasses[color] || colorClasses.default;
    const textColor = color === 'white' ? 'text-[--color-mx-white]' : 'text-[--color-mx-white]';
    const subTextColor = color === 'white' ? 'text-gray-600' : 'text-gray-400';

    return (
        <a href={href || '#'} className={`block rounded-xl shadow-lg p-6 border border-gray-700/50 relative overflow-hidden group ${selectedColor} hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300`}>
                {icon && <div className="text-6xl">{icon}</div>}
            </div>

            <div className="relative z-10">
                <h3 className={`text-sm font-medium uppercase tracking-wider mb-1 ${subTextColor}`}>{title}</h3>
                <div className={`text-3xl font-bold ${textColor}`}>{value}</div>

                <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 mt-4 rounded-full ${color === 'green' ? 'bg-green-400' : color === 'red' ? 'bg-red-400' : 'bg-gray-500'}`}></div>
            </div>
        </a>
    );
}
