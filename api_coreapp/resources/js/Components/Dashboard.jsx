import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Title from './Title';
import StatsCard from './DashboardWidgets/StatsCard';
import MatchCard from './DashboardWidgets/MatchCard';
import LeagueTable from './DashboardWidgets/LeagueTable';

export default function Dashboard() {
    // Mock Data
    const leagueTableData = [
        { name: 'RECORD', played: 12, points: 28, diff: 14 },
        { name: 'ZAPOTITLAN FC', played: 12, points: 25, diff: 8 },
        { name: 'ZAMORA', played: 12, points: 24, diff: 10 },
        { name: 'MORELOS', played: 12, points: 20, diff: 2 },
        { name: 'NECAXA', played: 12, points: 18, diff: -1 },
    ];

    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex flex-col justify-between font-sans text-[--color-mx-white]">
            <div>
                <Header />
                <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                    <Title title="Panel de Control" />

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatsCard title="Equipos Registrados" value="18" icon="🛡️" color="green" href="/equipos" />
                        <StatsCard title="Jugadores Activos" value="18" icon="🏃" color="white" href="/jugadores" />
                        <StatsCard title="Partidos Jugados" value="94" icon="⚽" color="red" href="/partidos" />
                        <StatsCard title="Árbitros" value="23" icon="🚩" color="default" href="/arbitros" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area - Left Column */}
                        <div className="lg:col-span-2 space-y-8">

                            <section>
                                <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-red-600 rounded-sm"></span>
                                    Partido Destacado
                                </h2>
                                <MatchCard
                                    homeTeam="RECORD"
                                    awayTeam="MonterreyMORELOS"
                                    time="Sábado 20:00"
                                    status="LIVE"
                                    stadium="ZAPOTITLAN 2"
                                />
                            </section>

                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h3 className="font-bold text-white mb-2">Próxima Jornada</h3>
                                    <p className="text-gray-400 text-sm">Jornada 13 - 24/10/2026</p>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                            <span>Pachuca vs León</span>
                                            <span className="text-gray-400">18:00</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                            <span>Atlas vs Santos</span>
                                            <span className="text-gray-400">20:00</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-900 to-gray-900 rounded-xl p-6 border border-green-800 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-white mb-2">Noticias de la Liga</h3>
                                        <p className="text-green-100 text-sm mb-4">Nuevas regulaciones para la temporada de invierno aprobadas.</p>
                                        <button className="text-xs font-bold uppercase bg-white text-green-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">Leer Más</button>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12">📰</div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - Right Column */}
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-green-600 rounded-sm"></span>
                                Tabla General
                            </h2>
                            <LeagueTable teams={leagueTableData} />
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
}
