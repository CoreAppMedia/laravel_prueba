import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StatsCard from './DashboardWidgets/StatsCard';
import MatchCard from './DashboardWidgets/MatchCard';
import LeagueTable from './DashboardWidgets/LeagueTable';
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
                className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"
                style={{ flex: 1, paddingTop: 0, paddingBottom: 64 }}
            >
                {/* Stats flotantes sobre el hero */}
                <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger animate-fade-in-up"
                    style={{ marginTop: -56, marginBottom: 48, position: 'relative', zIndex: 10 }}
                >
                    <StatsCard title="Goles esta Fecha" value="42" icon="Activity" color="terra" />
                    <StatsCard title="Jugadores" value="1,240" icon="Users" color="slate" />
                    <StatsCard title="Clubes" value="18" icon="Star" color="sage" />
                    <StatsCard title="Próximos Partidos" value="9" icon="Trophy" color="gold" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* ── Columna principal (izquierda) ── */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Partido destacado */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div>
                                    <div className="text-label" style={{ marginBottom: 6 }}>Partido Destacado</div>
                                    <h2
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 24,
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
                                    Calendario <ArrowRight size={13} />
                                </a>
                            </div>
                            <MatchCard
                                homeTeam="RECORD FC"
                                awayTeam="MORELOS"
                                time="En Juego"
                                status="LIVE"
                                stadium="Estadio Zapotitlán II"
                            />
                        </section>

                        {/* Dos tarjetas informativas */}
                        <section>
                            <div className="text-label" style={{ marginBottom: 16 }}>Agenda y Novedades</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Próxima jornada */}
                                <div
                                    className="card-padded"
                                    style={{ boxShadow: 'var(--shadow-soft)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                        <Calendar size={18} style={{ color: 'var(--color-terra)' }} />
                                        <span className="text-label">Jornada 12</span>
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: 'var(--color-text-primary)',
                                            marginBottom: 4,
                                        }}
                                    >
                                        Próxima Jornada
                                    </div>
                                    <div className="text-label" style={{ marginBottom: 20 }}>
                                        Sábado 24 Octubre
                                    </div>

                                    <div className="divider" style={{ marginBottom: 16 }} />

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { home: 'Pachuca', away: 'León', hora: '18:00' },
                                            { home: 'Atlas', away: 'Santos', hora: '20:00' },
                                        ].map(m => (
                                            <div
                                                key={m.home}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    background: 'var(--color-bg-surface-alt)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--color-border-subtle)',
                                                    cursor: 'pointer',
                                                    transition: 'border-color 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-terra)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-subtle)'}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: 'var(--color-text-secondary)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    {m.home} vs {m.away}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        color: 'var(--color-sage)',
                                                        background: 'var(--color-sage-light)',
                                                        border: '1px solid rgba(58,107,82,0.2)',
                                                        borderRadius: 4,
                                                        padding: '2px 8px',
                                                    }}
                                                >
                                                    {m.hora}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Noticia */}
                                <div
                                    style={{
                                        background: 'var(--color-text-primary)',
                                        border: '1px solid transparent',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 28,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        gap: 24,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-medium)',
                                    }}
                                >
                                    {/* Acento decorativo */}
                                    <div
                                        style={{
                                            position: 'absolute', top: 0, left: 0, right: 0,
                                            height: 3,
                                            background: 'var(--gradient-brand)',
                                        }}
                                    />
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
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: '#FFFFFF',
                                                lineHeight: 1.3,
                                                letterSpacing: '-0.2px',
                                            }}
                                        >
                                            La liga estrena nuevo reglamento para el Clausura 2026.
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
                                        }}
                                    >
                                        Leer más <ArrowRight size={13} />
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Sidebar (derecha) ── */}
                    <aside className="lg:col-span-4">
                        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Tabla de posiciones */}
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 14,
                                    }}
                                >
                                    <div className="text-label">Clasificación</div>
                                    <a
                                        href="#"
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: 'var(--color-terra)',
                                            textDecoration: 'none',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        Ver completa
                                    </a>
                                </div>
                                <LeagueTable teams={leagueTableData} />
                            </div>

                            {/* CTA Registro */}
                            <div
                                className="card"
                                style={{
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-medium)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ height: 3, background: 'var(--color-terra)' }} />
                                <div style={{ padding: '20px 20px 20px' }}>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 9,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '1.5px',
                                            color: 'var(--color-terra)',
                                            background: 'var(--color-terra-light)',
                                            border: '1px solid rgba(192,68,42,0.2)',
                                            borderRadius: 4,
                                            padding: '3px 8px',
                                            marginBottom: 12,
                                        }}
                                    >
                                        Convocatoria abierta
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: 'var(--color-text-primary)',
                                            lineHeight: 1.3,
                                            marginBottom: 8,
                                        }}
                                    >
                                        ¿Tu club aún no está registrado?
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 12,
                                            color: 'var(--color-text-muted)',
                                            lineHeight: 1.55,
                                            marginBottom: 16,
                                        }}
                                    >
                                        Únete a la liga para la próxima temporada. Inscripciones abiertas hasta el 30 de noviembre.
                                    </p>
                                    <div
                                        style={{
                                            height: 1,
                                            background: 'var(--color-border-subtle)',
                                            width: '100%',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 0, top: 0, bottom: 0,
                                                width: '30%',
                                                background: 'var(--color-terra)',
                                                borderRadius: 1,
                                                transition: 'width 0.5s ease',
                                            }}
                                            className="cta-bar"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}