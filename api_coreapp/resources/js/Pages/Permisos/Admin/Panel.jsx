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
            color: 'text-blue-600',
            glow: 'group-hover:from-blue-500/20',
            bg: 'bg-blue-50',
            desc: 'Configuración de periodos de liga y fechas generales.',
            count: stats.temporadas
        },
        {
            title: 'Torneos',
            path: '/panel/admin/torneos',
            icon: Trophy,
            color: 'text-orange-600',
            glow: 'group-hover:from-orange-500/20',
            bg: 'bg-orange-50',
            desc: 'Gestión de ligas, copas y sus categorías.',
            count: stats.torneos
        },
        {
            title: 'Clubes',
            path: '/panel/admin/clubes',
            icon: Shield,
            color: 'text-red-600',
            glow: 'group-hover:from-red-500/20',
            bg: 'bg-red-50',
            desc: 'Administración de organizaciones y sedes.',
            count: stats.clubes
        },
        {
            title: 'Equipos',
            path: '/panel/admin/equipos',
            icon: Users,
            color: 'text-mx-green',
            glow: 'group-hover:from-green-500/20',
            bg: 'bg-green-50',
            desc: 'Control de plantillas registradas por categoría.',
            count: stats.equipos
        },
    ];

    return (
        <BasePanel titulo="Panel de Control">
            {/* Stats Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-soft">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Crecimiento</div>
                        <div className="text-xl font-black text-slate-900">Activo</div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-soft">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Estado API</div>
                        <div className="text-xl font-black text-slate-900">Estable</div>
                    </div>
                </div>
                <div className="md:col-span-2 bg-gradient-to-r from-mx-green/[0.03] to-mx-red/[0.03] border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-soft">
                    <div>
                        <div className="text-xs font-black text-slate-800 uppercase tracking-tight">Bienvenido al Panel de Control de 2026</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">Gestiona tu liga de fútbol con la tecnología más avanzada.</div>
                    </div>
                    <Trophy size={40} className="text-orange-500/20 hidden lg:block" />
                </div>
            </div>

            <h2 className="text-xl font-black mb-8 text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-mx-green rounded-full shadow-sm shadow-mx-green/40"></span>
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

                                <div className="relative h-full bg-white border border-slate-200 group-hover:border-mx-green/30 rounded-[1.5rem] p-5 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden shadow-soft group-hover:shadow-premium">
                                    <div className={`w-14 h-14 ${mod.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-inner`}>
                                        <Icon size={28} className={`${mod.color}`} />
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 mb-1 whitespace-nowrap">{mod.title}</h3>
                                    <p className="text-slate-500 text-[10px] leading-tight mb-4 font-bold px-2 uppercase tracking-tight">
                                        {mod.desc}
                                    </p>

                                    {/* Action footer */}
                                    <div className="mt-auto w-full pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Registros</span>
                                            <span className={`text-xs font-black ${mod.color}`}>{loading ? '...' : mod.count}</span>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-theme-gradient group-hover:border-none transition-all duration-300`}>
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
            <div className="mt-16 p-8 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-soft">
                <div className="p-4 bg-mx-green/10 rounded-2xl text-mx-green shadow-inner">
                    <Activity size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black text-slate-900">Consejo del Desarrollador</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">
                        Recuerda que los cambios en las **Temporadas** afectan el calendario de todos los torneos vinculados. Realiza modificaciones con precaución durante la temporada activa.
                    </p>
                </div>
                <Link to="/panel/admin/temporadas">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 border border-slate-200">
                        Revisar Calendario
                    </button>
                </Link>
            </div>
        </BasePanel>
    );
}
