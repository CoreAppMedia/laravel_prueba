import React from 'react';
import { MapPin, Calendar, Clock, Sword } from 'lucide-react';

export default function MatchCard({ homeTeam, awayTeam, time, status, stadium }) {
    const isLive = status === 'LIVE';

    return (
        <div
            style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-premium)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Background Decorativo Premium */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '140px',
                    background: 'linear-gradient(135deg, var(--color-slate) 0%, #1a2533 100%)',
                    zIndex: 0,
                }}
            />
            {/* Overlay sutil estilo cristal en la parte superior */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '140px',
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            {/* Cabecera Flotante */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px 0',
                }}
            >
                {isLive ? (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            background: 'rgba(192,68,42,0.15)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(192,68,42,0.3)',
                            borderRadius: 20,
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#ff8a75', // Un terra más claro para fondo oscuro
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff8a75' }} className="animate-pulse" />
                        Transmisión En Vivo
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 20,
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        <Calendar size={12} />
                        Próximo Encuentro
                    </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)' }}>
                    <Clock size={14} />
                    <span
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '1px',
                        }}
                    >
                        {time}
                    </span>
                </div>
            </div>

            {/* Zona de Equipos */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px 40px',
                    marginTop: 10,
                }}
            >
                {/* Equipo Local */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            border: '4px solid rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 36,
                            position: 'relative',
                        }}
                    >
                        🛡️
                        {/* Pequeño indicador de localía */}
                        <div style={{
                            position: 'absolute', bottom: -10,
                            background: 'var(--color-bg-surface)',
                            border: '1px solid var(--color-border-subtle)',
                            padding: '2px 8px', borderRadius: 10,
                            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                            textTransform: 'uppercase', color: 'var(--color-text-muted)'
                        }}>
                            Local
                        </div>
                    </div>
                    <h3
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 20,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            marginTop: 12,
                        }}
                    >
                        {homeTeam}
                    </h3>
                </div>

                {/* VS / Score Centrado */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 20px', marginTop: 30 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'var(--color-bg-surface-alt)',
                            border: '1px solid var(--color-border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 8,
                            color: 'var(--color-text-ghost)'
                        }}
                    >
                        <Sword size={20} />
                    </div>
                </div>

                {/* Equipo Visitante */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            border: '4px solid rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 36,
                            position: 'relative',
                        }}
                    >
                        ⚽
                        <div style={{
                            position: 'absolute', bottom: -10,
                            background: 'var(--color-bg-surface)',
                            border: '1px solid var(--color-border-subtle)',
                            padding: '2px 8px', borderRadius: 10,
                            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                            textTransform: 'uppercase', color: 'var(--color-text-muted)'
                        }}>
                            Visita
                        </div>
                    </div>
                    <h3
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 20,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            marginTop: 12,
                        }}
                    >
                        {awayTeam}
                    </h3>
                </div>
            </div>

            {/* Footer con info del estadio y botón */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 32px',
                    background: 'var(--color-bg-surface-alt)',
                    borderTop: '1px solid var(--color-border-subtle)',
                    marginTop: 'auto',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-terra-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-terra)' }}>
                        <MapPin size={16} />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                            Sede del Encuentro
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                            {stadium}
                        </div>
                    </div>
                </div>

                <button
                    className="btn"
                    style={{
                        background: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-strong)',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}