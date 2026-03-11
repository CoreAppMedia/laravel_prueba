import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StatsCard from './DashboardWidgets/StatsCard';
import MatchCard from './DashboardWidgets/MatchCard';
import LeagueTable from './DashboardWidgets/LeagueTable';
import ReglamentoWidget from './DashboardWidgets/ReglamentoWidget';
import ConvocatoriaWidget from './DashboardWidgets/ConvocatoriaWidget';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';

export default function Dashboard() {

    const leagueTableData = [
        { name: 'RECORD FC', played: 12, points: 28, diff: 14 },
        { name: 'ZAPOTITLAN FC', played: 12, points: 25, diff: 8 },
        { name: 'CD ZAMORA', played: 12, points: 24, diff: 10 },
        { name: 'MORELOS', played: 12, points: 20, diff: 2 },
        { name: 'NECAXA JP', played: 12, points: 18, diff: -1 },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-bg-main)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-primary)',
                overflowX: 'hidden',
                width: '100%',
                position: 'relative'
            }}
        >
            <Header />

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
                <img
                    src="/images/hero_stadium.png"
                    alt="Estadio Zapotitlán"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                    }}
                    className="animate-slow-zoom"
                />
                {/* Gradiente oscuro editorial */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,8,8,0.88) 0%, rgba(10,8,8,0.40) 50%, rgba(10,8,8,0.15) 100%)',
                }} />

                {/* Contenido hero */}
                <div
                    style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '0 0 48px',
                    }}
                    className="animate-fade-in-up"
                >
                    <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
                        {/* Etiqueta */}
                        <div style={{ marginBottom: 14 }}>
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '2.5px',
                                    color: 'var(--color-gold)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span style={{ width: 20, height: 1, background: 'var(--color-gold)', display: 'inline-block' }} />
                                Temporada 2025 · Jornada 11
                            </span>
                        </div>

                        <h1
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(36px, 6vw, 64px)',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                lineHeight: 1.05,
                                letterSpacing: '-0.5px',
                                marginBottom: 16,
                                maxWidth: 640,
                            }}
                        >
                            La liga más competitiva<br />
                            <span style={{ color: 'var(--color-gold)' }}>del corazón de México.</span>
                        </h1>

                        <p
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 15,
                                color: 'rgba(255,255,255,0.65)',
                                maxWidth: 440,
                                lineHeight: 1.6,
                                marginBottom: 28,
                            }}
                        >
                            Sigue a tus equipos, consulta resultados y vive cada partido como si estuvieras en la cancha.
                        </p>

                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button className="btn btn-primary">
                                Ver Jornada
                            </button>
                            <button
                                style={{
                                    background: 'rgba(255,255,255,0.10)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '10px 22px',
                                    color: '#fff',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                Tabla General
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN ─────────────────────────────────────────────────────── */}
            <main
                className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12 py-12 lg:py-16"
                style={{ flex: 1 }}
            >

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* ── Columna principal (izquierda) ── */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Partido destacado */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div>
                                    <div className="text-label" style={{ marginBottom: 6 }}>Partido de la Semana</div>
                                    <h2
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: 'var(--color-text-primary)',
                                            letterSpacing: '-0.3px',
                                        }}
                                    >
                                        Matchday Central
                                    </h2>
                                </div>
                                <a
                                    href="#"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: 'var(--color-terra)',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    Ver Calendario <ArrowRight size={13} />
                                </a>
                            </div>
                            <MatchCard
                                homeTeam="RECORD FC"
                                awayTeam="MORELOS"
                                time="Hoy, 20:00 hrs"
                                status="LIVE"
                                stadium="Estadio Zapotitlán II"
                            />
                        </section>

                        {/* Avisos y Reglamento (Nuevo Layout Grid) */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                {/* Columna Izquierda: Reglamento */}
                                <div>
                                    <div className="text-label" style={{ marginBottom: 16 }}>Normativa Liga</div>
                                    <ReglamentoWidget />
                                </div>

                                {/* Columna Derecha: Noticia Oficial */}
                                <div>
                                    <div className="text-label" style={{ marginBottom: 16 }}>Última Hora</div>
                                    <div
                                        style={{
                                            background: 'var(--color-text-primary)',
                                            borderRadius: 'var(--radius-lg)',
                                            padding: 28,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            height: '100%',
                                            minHeight: 220,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: 'var(--shadow-medium)',
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-brand)' }} />
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                                <Newspaper size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                                                <span
                                                    style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '2px',
                                                        color: 'rgba(255,255,255,0.4)',
                                                    }}
                                                >
                                                    Comunicado oficial
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: 22,
                                                    fontWeight: 700,
                                                    color: '#FFFFFF',
                                                    lineHeight: 1.3,
                                                    letterSpacing: '-0.2px',
                                                }}
                                            >
                                                Los horarios de la fase de liguilla han sido confirmados por la directiva.
                                            </p>
                                        </div>
                                        <a
                                            href="#"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                fontFamily: 'var(--font-body)',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: 'var(--color-gold)',
                                                textDecoration: 'none',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                marginTop: 20
                                            }}
                                        >
                                            Leer más <ArrowRight size={13} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Sidebar (derecha) ── */}
                    <aside className="lg:col-span-4">
                        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Convocatoria (Nuevo Componente) */}
                            <ConvocatoriaWidget />

                            {/* Tabla de posiciones rediseñada */}
                            <LeagueTable teams={leagueTableData} />
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}