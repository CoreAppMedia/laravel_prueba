import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../../../lib/http';
import BasePanel from '../BasePanel';
import { Calendar, Trophy, Shield, Users, Activity, TrendingUp, ArrowRight } from 'lucide-react';

export default function PanelAdmin() {
    const [stats, setStats] = useState({
        temporadas: 0,
        torneos: 0,
        clubes: 0,
        equipos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resTemp, resTor, resClub, resEqui] = await Promise.all([
                    http.get('/api/temporadas'),
                    http.get('/api/torneos'),
                    http.get('/api/clubs'),
                    http.get('/api/equipos'),
                ]);
                setStats({
                    temporadas: resTemp.data.length,
                    torneos: resTor.data.length,
                    clubes: resClub.data.length,
                    equipos: resEqui.data.length,
                });
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const modules = [
        {
            title: 'Temporadas',
            path: '/panel/admin/temporadas',
            icon: Calendar,
            color: 'text-blue-400',
            glow: 'group-hover:from-blue-500/10',
            bg: 'bg-blue-400/10',
            desc: 'Configuración de periodos de liga y fechas generales.',
            count: stats.temporadas
        },
        {
            title: 'Torneos',
            path: '/panel/admin/torneos',
            icon: Trophy,
            color: 'text-yellow-400',
            glow: 'group-hover:from-yellow-500/10',
            bg: 'bg-yellow-400/10',
            desc: 'Gestión de ligas, copas y sus categorías.',
            count: stats.torneos
        },
        {
            title: 'Clubes',
            path: '/panel/admin/clubes',
            icon: Shield,
            color: 'text-red-400',
            glow: 'group-hover:from-red-500/10',
            bg: 'bg-red-400/10',
            desc: 'Administración de organizaciones y sedes.',
            count: stats.clubes
        },
        {
            title: 'Equipos',
            path: '/panel/admin/equipos',
            icon: Users,
            color: 'text-mx-green',
            glow: 'group-hover:from-green-500/10',
            bg: 'bg-mx-green/10',
            desc: 'Control de plantillas registradas por categoría.',
            count: stats.equipos
        },
    ];

    return (
        <BasePanel titulo="Panel de Control">
            {/* Stats Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Crecimiento</div>
                        <div className="text-xl font-black text-white">Activo</div>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-mx-green/20 rounded-xl flex items-center justify-center text-mx-green">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Estado API</div>
                        <div className="text-xl font-black text-white">Estable</div>
                    </div>
                </div>
                <div className="md:col-span-2 bg-gradient-to-r from-mx-green/10 to-mx-red/10 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-bold text-white uppercase tracking-tight">Bienvenido al Panel de Control de 2026</div>
                        <div className="text-sm text-slate-400 mt-1">Gestiona tu liga de fútbol con la tecnología más avanzada.</div>
                    </div>
                    <Trophy size={40} className="text-yellow-500/50 hidden lg:block" />
                </div>
            </div>

            <h2 className="text-xl font-black mb-8 text-white flex items-center gap-3">
                <span className="w-1 h-6 bg-mx-green rounded-full"></span>
                Gestión de Operaciones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                        <Link key={idx} to={mod.path} className="block group">
                            <div className="relative h-full">
                                {/* Glow Effect on hover */}
                                <div className={`absolute -inset-2 bg-gradient-to-br from-transparent to-transparent ${mod.glow} group-hover:to-transparent rounded-[2rem] blur-xl transition duration-500`}></div>

                                <div className="relative h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 group-hover:border-slate-600 rounded-[1.5rem] p-5 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden">
                                    <div className={`w-14 h-14 ${mod.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon size={28} className={`${mod.color}`} />
                                    </div>

                                    <h3 className="text-lg font-black text-white mb-1 whitespace-nowrap">{mod.title}</h3>
                                    <p className="text-slate-400 text-[10px] leading-tight mb-4 font-medium px-2">
                                        {mod.desc}
                                    </p>

                                    {/* Action footer */}
                                    <div className="mt-auto w-full pt-3 border-t border-slate-800/50 flex items-center justify-between">
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Registros</span>
                                            <span className={`text-xs font-black ${mod.color}`}>{loading ? '...' : mod.count}</span>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:bg-theme-gradient group-hover:border-none transition-all duration-300`}>
                                            <ArrowRight size={14} className="text-slate-400 group-hover:text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Alert Section */}
            <div className="mt-16 p-8 bg-slate-900/30 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-400 shadow-inner">
                    <Activity size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-white">Consejo del Desarrollador</h4>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                        Recuerda que los cambios en las **Temporadas** afectan el calendario de todos los torneos vinculados. Realiza modificaciones con precaución durante la temporada activa.
                    </p>
                </div>
                <Link to="/panel/admin/temporadas">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg active:scale-95">
                        Revisar Calendario
                    </button>
                </Link>
            </div>
        </BasePanel>
    );
}
