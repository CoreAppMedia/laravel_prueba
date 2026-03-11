import React from 'react';
import { MapPin } from 'lucide-react';

export default function MatchCard({ homeTeam, awayTeam, time, status, stadium }) {
    const isLive = status === 'LIVE';

    return (
        <div
            style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-medium)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-soft)'}
        >
            {/* Banda superior de estado */}
            <div
                style={{
                    height: 3,
                    background: isLive
                        ? 'var(--color-terra)'
                        : 'var(--gradient-brand)',
                    position: 'relative',
                    overflow: isLive ? 'hidden' : 'visible',
                }}
            >
                {isLive && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255,255,255,0.4)',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                    />
                )}
            </div>

            {/* Cabecera: estado + jornada */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 24px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-surface-alt)',
                }}
            >
                {isLive ? (
                    <div className="status-pill active">
                        <span className="status-dot" />
                        En Vivo
                    </div>
                ) : (
                    <div className="status-pill pending">
                        Próximo Partido
                    </div>
                )}
                <span
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: 'var(--color-text-ghost)',
                    }}
                >
                    {time}
                </span>
            </div>

            {/* Equipos */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '32px 24px',
                    gap: 16,
                }}
            >
                {/* Local */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-bg-surface-alt)',
                            border: '1px solid var(--color-border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                        }}
                    >
                        🛡️
                    </div>
                    <div
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            textAlign: 'center',
                            lineHeight: 1.3,
                        }}
                    >
                        {homeTeam}
                    </div>
                    <span className="text-label">Local</span>
                </div>

                {/* Centro */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        flexShrink: 0,
                        padding: '0 8px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <div style={{ height: 1, width: 20, background: 'var(--color-border-strong)' }} />
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 22,
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            vs
                        </span>
                        <div style={{ height: 1, width: 20, background: 'var(--color-border-strong)' }} />
                    </div>
                </div>

                {/* Visitante */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-bg-surface-alt)',
                            border: '1px solid var(--color-border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                        }}
                    >
                        ⚽
                    </div>
                    <div
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            textAlign: 'center',
                            lineHeight: 1.3,
                        }}
                    >
                        {awayTeam}
                    </div>
                    <span className="text-label">Visitante</span>
                </div>
            </div>

            {/* Estadio */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderTop: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-surface-alt)',
                }}
            >
                <MapPin size={12} style={{ color: 'var(--color-terra)', flexShrink: 0 }} />
                <span
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    {stadium}
                </span>
            </div>
        </div>
    );
}