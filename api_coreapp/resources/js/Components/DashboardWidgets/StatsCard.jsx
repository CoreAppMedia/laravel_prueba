import React from 'react';
import * as Lucide from 'lucide-react';

/**
 * color prop acepta: 'terra' | 'gold' | 'sage' | 'slate'
 * (también backward-compat con: 'red', 'green', 'white', 'default')
 */
const COLOR_MAP = {
    terra: { accent: 'var(--color-terra)', light: 'var(--color-terra-light)', border: 'rgba(192,68,42,0.2)' },
    gold: { accent: 'var(--color-gold)', light: 'var(--color-gold-light)', border: 'rgba(160,120,40,0.2)' },
    sage: { accent: 'var(--color-sage)', light: 'var(--color-sage-light)', border: 'rgba(58,107,82,0.2)' },
    slate: { accent: 'var(--color-slate)', light: 'var(--color-slate-light)', border: 'rgba(59,79,107,0.2)' },
    // backward-compat aliases
    red: { accent: 'var(--color-terra)', light: 'var(--color-terra-light)', border: 'rgba(192,68,42,0.2)' },
    green: { accent: 'var(--color-sage)', light: 'var(--color-sage-light)', border: 'rgba(58,107,82,0.2)' },
    white: { accent: 'var(--color-slate)', light: 'var(--color-slate-light)', border: 'rgba(59,79,107,0.2)' },
    default: { accent: 'var(--color-gold)', light: 'var(--color-gold-light)', border: 'rgba(160,120,40,0.2)' },
};

export default function StatsCard({ title, value, icon, color = 'terra', href }) {
    const IconComponent = typeof icon === 'string' && Lucide[icon] ? Lucide[icon] : null;
    const cfg = COLOR_MAP[color] || COLOR_MAP.terra;

    return (
        <a
            href={href || '#'}
            style={{
                display: 'block',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderTop: `3px solid ${cfg.accent}`,
                borderRadius: 'var(--radius-lg)',
                padding: '20px 20px 18px',
                boxShadow: 'var(--shadow-soft)',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Icono de fondo decorativo */}
            <div
                style={{
                    position: 'absolute',
                    right: -10,
                    bottom: -10,
                    width: 64,
                    height: 64,
                    background: cfg.light,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.6,
                }}
            >
                {IconComponent && (
                    <IconComponent size={28} style={{ color: cfg.accent, opacity: 0.5 }} />
                )}
            </div>

            {/* Icono principal */}
            <div
                style={{
                    width: 36,
                    height: 36,
                    background: cfg.light,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                    flexShrink: 0,
                }}
            >
                {IconComponent
                    ? <IconComponent size={18} style={{ color: cfg.accent }} />
                    : <span style={{ fontSize: 16 }}>{icon}</span>
                }
            </div>

            {/* Etiqueta */}
            <div
                style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1.8px',
                    color: 'var(--color-text-muted)',
                    marginBottom: 4,
                }}
            >
                {title}
            </div>

            {/* Valor */}
            <div
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 32,
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                    letterSpacing: '-0.5px',
                    marginBottom: 14,
                }}
            >
                {value}
            </div>

            {/* Línea de acento */}
            <div
                style={{
                    height: 2,
                    width: 28,
                    borderRadius: 1,
                    background: cfg.accent,
                    opacity: 0.7,
                }}
            />
        </a>
    );
}