import React from 'react';
import * as Lucide from 'lucide-react';

export default function StatsCard({ title, value, icon, color, href }) {
    // Map emoji or string icons to Lucide components if possible, or use the icon directly
    const IconComponent = typeof icon === 'string' && Lucide[icon] ? Lucide[icon] : null;

    const colorConfigs = {
        green: {
            bg: 'bg-green-50',
            icon: 'text-mx-green',
            accent: 'bg-mx-green',
            shadow: 'hover:shadow-green-500/10'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-mx-red',
            accent: 'bg-mx-red',
            shadow: 'hover:shadow-red-500/10'
        },
        white: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            accent: 'bg-blue-600',
            shadow: 'hover:shadow-blue-500/10'
        },
        default: {
            bg: 'bg-slate-50',
            icon: 'text-slate-600',
            accent: 'bg-slate-600',
            shadow: 'hover:shadow-slate-500/10'
        }
    };

    const config = colorConfigs[color] || colorConfigs.default;

    return (
        <a
            href={href || '#'}
            className={`block bg-white border border-[--color-border-subtle] rounded-2xl p-6 relative overflow-hidden group shadow-soft hover:shadow-premium ${config.shadow} transition-all duration-500 hover:-translate-y-1`}
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${config.bg} rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700 ease-out flex items-center justify-center`}>
                <div className={`${config.icon} opacity-20 group-hover:opacity-40 transition-opacity`}>
                    {IconComponent ? <IconComponent size={64} /> : <span className="text-4xl">{icon}</span>}
                </div>
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center mb-4 border border-white shadow-sm`}>
                    <div className={config.icon}>
                        {IconComponent ? <IconComponent size={24} /> : <span className="text-xl">{icon}</span>}
                    </div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-widest text-[--color-text-muted] mb-1 group-hover:text-slate-600 transition-colors">
                    {title}
                </h3>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {value}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className={`h-1.5 w-12 rounded-full ${config.accent}`}></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-100"></div>
                </div>
            </div>
        </a>
    );
}
