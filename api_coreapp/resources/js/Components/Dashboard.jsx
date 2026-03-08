import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StatsCard from './DashboardWidgets/StatsCard';
import MatchCard from './DashboardWidgets/MatchCard';
import LeagueTable from './DashboardWidgets/LeagueTable';
import { Trophy, Star, Activity, Users, ArrowRight, PlayCircle, Calendar, Newspaper } from 'lucide-react';

export default function Dashboard() {
    // Mock Data
    const leagueTableData = [
        { name: 'RECORD FC', played: 12, points: 28, diff: 14 },
        { name: 'ZAPOTITLAN FC', played: 12, points: 25, diff: 8 },
        { name: 'CD ZAMORA', played: 12, points: 24, diff: 10 },
        { name: 'MORELOS', played: 12, points: 20, diff: 2 },
        { name: 'NECAXA JP', played: 12, points: 18, diff: -1 },
    ];

    return (
        <div className="min-h-screen bg-[--color-bg-main] flex flex-col justify-between font-sans text-[--color-text-primary]">
            <div>
                <Header />

                {/* Hero Section - High Impact */}
                <div className="relative h-[600px] w-full overflow-hidden">
                    <img
                        src="/images/hero_stadium.png"
                        alt="Zapotitlán Stadium"
                        className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
                        <div className="animate-fade-in-up">
                            <span className="px-4 py-1.5 bg-mx-green/90 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full backdrop-blur-md border border-white/20 mb-6 inline-block">
                                Temporada 2026 | Liga Zapotitlán
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl italic">
                                Vive la <span className="text-mx-red">Pasión</span> <br />
                                <span className="text-gradient-metallic bg-white">Del Fútbol</span>
                            </h1>
                            <p className="text-xl text-slate-200 font-medium max-w-2xl mx-auto mb-10 drop-shadow-lg">
                                La liga más competitiva del corazón de México. Sigue a tus equipos, consulta resultados y vive cada partido como si estuvieras en la cancha.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-8 py-4 bg-mx-green text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-green-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
                                    <PlayCircle size={20} className="group-hover:rotate-12 transition-transform" />
                                    Ver Jornada
                                </button>
                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/20 transition-all">
                                    Tabla General
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* League Highlights Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 mb-20 relative z-20">
                        <StatsCard title="Goles esta Fecha" value="42" icon="Activity" color="red" />
                        <StatsCard title="Jugadores Pro" value="1,240" icon="Users" color="white" />
                        <StatsCard title="Clubes Unidos" value="18" icon="Star" color="green" />
                        <StatsCard title="Próximos Partidos" value="9" icon="Trophy" color="default" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Highlights & News - Left Column */}
                        <div className="lg:col-span-8 space-y-16">

                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                            Matchday <span className="text-mx-green">Central</span>
                                        </h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">El partido más esperado de la semana</p>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-mx-green hover:text-green-800 transition-colors bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                        Explorar Calendario <ArrowRight size={14} />
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-mx-red/20 to-mx-green/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                                    <MatchCard
                                        homeTeam="RECORD FC"
                                        awayTeam="MORELOS"
                                        time="En Juego"
                                        status="LIVE"
                                        stadium="ESTADIO ZAPOTITLAN II"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-soft relative overflow-hidden group hover:shadow-premium transition-all">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <Calendar size={24} className="text-mx-red" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Agenda</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Próxima Jornada</h3>
                                            <p className="text-slate-500 font-bold text-sm mb-6 uppercase tracking-widest">Sábado 24 Octubre</p>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-mx-green/30 transition-all cursor-pointer">
                                                    <span className="text-xs font-black text-slate-700 uppercase">Pachuca vs León</span>
                                                    <span className="text-[10px] font-black text-mx-green bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">18:00</span>
                                                </div>
                                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-mx-green/30 transition-all cursor-pointer">
                                                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Atlas vs Santos</span>
                                                    <span className="text-[10px] font-black text-mx-green bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">20:00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-mx-green to-[#0a3528] rounded-[2rem] p-10 border border-transparent shadow-premium relative overflow-hidden group">
                                        <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                                    <Newspaper size={20} className="text-white" />
                                                </div>
                                                <h3 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Noticias</h3>
                                            </div>
                                            <h4 className="text-2xl font-black text-white leading-tight mb-6 tracking-tight">
                                                La liga estrena nuevo reglamento para el Clausura 2026.
                                            </h4>
                                            <button className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-mx-green px-6 py-3 rounded-2xl hover:bg-slate-100 transition-all group/btn">
                                                Leer Más <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - Right Column */}
                        <div className="lg:col-span-4 space-y-12">
                            <aside className="sticky top-10 space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3 italic mb-6">
                                        <Trophy size={20} className="text-orange-500" />
                                        Clasificación
                                    </h2>
                                    <LeagueTable teams={leagueTableData} />
                                </div>

                                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-soft group cursor-pointer hover:shadow-premium transition-all overflow-hidden relative">
                                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-mx-red/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <span className="text-[9px] font-black text-mx-red uppercase tracking-widest px-3 py-1 bg-red-50 rounded-full inline-block mb-4 border border-red-100">Comunicado</span>
                                        <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-mx-red transition-colors">¿Tu club aún no está registrado?</h3>
                                        <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tight">Une a tu equipo a la liga más grande de la región para la próxima temporada.</p>
                                        <div className="mt-6 h-1 w-12 bg-mx-red rounded-full group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
