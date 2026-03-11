import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LeagueTable({ teams }) {
    return (
        <div
            style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'var(--color-bg-surface-alt)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                }}
            >
                <span
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    Clasificación
                </span>
                <span
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: 'var(--color-terra)',
                        background: 'var(--color-terra-light)',
                        border: '1px solid rgba(192,68,42,0.2)',
                        borderRadius: 4,
                        padding: '2px 8px',
                    }}
                >
                    Jornada 12
                </span>
            </div>

            {/* Tabla */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        {['#', 'Club', 'PJ', 'PTS', 'DIF'].map((h, i) => (
                            <th
                                key={h}
                                style={{
                                    padding: '9px 14px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    color: 'var(--color-text-ghost)',
                                    textAlign: i > 1 ? 'center' : 'left',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {teams.map((team, index) => {
                        const isFirst = index === 0;
                        const isRising = index < 2;
                        const isFalling = index > 3;

                        return (
                            <tr
                                key={index}
                                style={{
                                    borderBottom: index < teams.length - 1
                                        ? '1px solid var(--color-border-subtle)'
                                        : 'none',
                                    background: isFirst ? 'rgba(160,120,40,0.04)' : 'transparent',
                                    transition: 'background 0.15s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-surface-alt)'}
                                onMouseLeave={e => e.currentTarget.style.background = isFirst ? 'rgba(160,120,40,0.04)' : 'transparent'}
                            >
                                {/* Posición */}
                                <td style={{ padding: '11px 14px', width: 44 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {isFirst ? (
                                            <svg width="14" height="14" viewBox="0 0 14 14">
                                                <polygon
                                                    points="7,1 8.8,5.6 13.7,5.9 10,9.1 11.1,14 7,11.3 2.9,14 4,9.1 0.3,5.9 5.2,5.6"
                                                    fill="var(--color-gold)"
                                                />
                                            </svg>
                                        ) : (
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: 'var(--color-text-muted)',
                                                    width: 14,
                                                    textAlign: 'center',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {index + 1}
                                            </span>
                                        )}
                                        {isRising && (
                                            <TrendingUp size={10} style={{ color: 'var(--color-sage)', flexShrink: 0 }} />
                                        )}
                                        {isFalling && (
                                            <TrendingDown size={10} style={{ color: 'var(--color-terra)', flexShrink: 0 }} />
                                        )}
                                        {!isRising && !isFalling && (
                                            <Minus size={10} style={{ color: 'var(--color-text-ghost)', flexShrink: 0 }} />
                                        )}
                                    </div>
                                </td>

                                {/* Club */}
                                <td style={{ padding: '11px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div
                                            style={{
                                                width: 4,
                                                height: 16,
                                                borderRadius: 2,
                                                background: isFirst
                                                    ? 'var(--color-gold)'
                                                    : 'var(--color-border-strong)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div>
                                            <div
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: 'var(--color-text-primary)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.4px',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {team.name}
                                            </div>
                                            {isFirst && (
                                                <div
                                                    style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: 9,
                                                        fontWeight: 600,
                                                        color: 'var(--color-gold)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                    }}
                                                >
                                                    Líder
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* PJ */}
                                <td
                                    style={{
                                        padding: '11px 14px',
                                        textAlign: 'center',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 12,
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {team.played}
                                </td>

                                {/* PTS */}
                                <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: isFirst ? 'var(--color-gold)' : 'var(--color-text-primary)',
                                        }}
                                    >
                                        {team.points}
                                    </span>
                                </td>

                                {/* DIF */}
                                <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: '2px 7px',
                                            borderRadius: 4,
                                            background: team.diff > 0
                                                ? 'var(--color-sage-light)'
                                                : team.diff < 0
                                                    ? 'var(--color-terra-light)'
                                                    : 'var(--color-bg-surface-alt)',
                                            color: team.diff > 0
                                                ? 'var(--color-sage)'
                                                : team.diff < 0
                                                    ? 'var(--color-terra)'
                                                    : 'var(--color-text-ghost)',
                                            border: team.diff > 0
                                                ? '1px solid rgba(58,107,82,0.2)'
                                                : team.diff < 0
                                                    ? '1px solid rgba(192,68,42,0.2)'
                                                    : '1px solid var(--color-border-subtle)',
                                        }}
                                    >
                                        {team.diff > 0 ? `+${team.diff}` : team.diff}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pie */}
            <div
                style={{
                    padding: '12px 18px',
                    borderTop: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-surface-alt)',
                    textAlign: 'center',
                }}
            >
                <a
                    href="#"
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-terra)',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Ver tabla completa
                </a>
            </div>
        </div>
    );
}