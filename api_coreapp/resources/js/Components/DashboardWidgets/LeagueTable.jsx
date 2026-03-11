import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export default function LeagueTable({ teams }) {
    return (
        <div
            style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header Rediseñado */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                }}
            >
                <div>
                    <h3
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 18,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            lineHeight: 1,
                            marginBottom: 4,
                        }}
                    >
                        Clasificación General
                    </h3>
                    <span
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        Apertura 2025 · Jornada 12
                    </span>
                </div>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--color-bg-surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                    }}
                >
                    <Info size={16} />
                </div>
            </div>

            {/* Tabla */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-bg-surface-alt)' }}>
                            <th style={{ padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', width: 60 }}>#</th>
                            <th style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)' }}>Club</th>
                            <th style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', textAlign: 'center' }}>PJ</th>
                            <th style={{ padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', textAlign: 'center' }}>DIF</th>
                            <th style={{ padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', textAlign: 'center' }}>PTS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((team, index) => {
                            const isLeader = index === 0;
                            const isRelegation = index >= teams.length - 2; // Supongamos que los últimos dos descienden
                            const isRising = index < 2 && index !== 0;

                            return (
                                <tr
                                    key={index}
                                    style={{
                                        borderBottom: '1px solid var(--color-border-subtle)',
                                        background: isLeader ? 'rgba(160,120,40,0.03)' : (isRelegation ? 'rgba(176,48,48,0.02)' : 'transparent'),
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {/* Posición y Tendencia */}
                                    <td style={{ padding: '14px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: 16,
                                                    fontWeight: 700,
                                                    color: isLeader ? 'var(--color-gold)' : (isRelegation ? 'var(--color-danger)' : 'var(--color-text-primary)'),
                                                    width: 18,
                                                }}
                                            >
                                                {index + 1}
                                            </span>
                                            {isRising ? <TrendingUp size={12} style={{ color: 'var(--color-sage)' }} /> : (isRelegation ? <TrendingDown size={12} style={{ color: 'var(--color-danger)' }} /> : <Minus size={12} style={{ color: 'var(--color-text-ghost)' }} />)}
                                        </div>
                                    </td>

                                    {/* Equipo */}
                                    <td style={{ padding: '14px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Avatar genérico */}
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-bg-surface)',
                                                    border: '1px solid var(--color-border-subtle)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 12,
                                                    boxShadow: 'var(--shadow-soft)'
                                                }}
                                            >
                                                🛡️
                                            </div>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: 'var(--color-text-primary)',
                                                }}
                                            >
                                                {team.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* PJ */}
                                    <td style={{ padding: '14px 14px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                                        {team.played}
                                    </td>

                                    {/* DIF */}
                                    <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: team.diff > 0 ? 'var(--color-sage)' : (team.diff < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)'),
                                            }}
                                        >
                                            {team.diff > 0 ? `+${team.diff}` : team.diff}
                                        </span>
                                    </td>

                                    {/* PTS (Destacado) */}
                                    <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                background: isLeader ? 'var(--color-gold)' : 'var(--color-bg-surface-alt)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontFamily: 'var(--font-display)',
                                                fontSize: 16,
                                                fontWeight: 700,
                                                color: isLeader ? '#fff' : 'var(--color-text-primary)',
                                            }}
                                        >
                                            {team.points}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer de Leyendas */}
            <div
                style={{
                    padding: '16px 24px',
                    background: 'var(--color-bg-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gold)' }} /> Campeón
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)' }} /> Descenso
                    </div>
                </div>
                
                <a
                    href="#"
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--color-terra)',
                        textDecoration: 'none',
                    }}
                >
                    Ver todo
                </a>
            </div>
        </div>
    );
}