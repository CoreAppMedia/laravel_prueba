import React from 'react';

/**
 * Variantes:
 *  - primary   → terracota sólido (acción principal)
 *  - secondary → borde + texto, sin fondo
 *  - ghost     → sin borde, solo texto
 *  - dark      → fondo oscuro (ink), para cards oscuras
 */
export default function GradientButton({
    children,
    className = '',
    type = 'button',
    onClick,
    disabled = false,
    icon: Icon,
    variant = 'primary',
}) {
    const styles = {
        primary: {
            background: 'var(--color-terra)',
            color: '#fff',
            border: '1px solid transparent',
            boxShadow: '0 2px 10px rgba(192,68,42,0.25)',
        },
        secondary: {
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-strong)',
            boxShadow: 'none',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: '1px solid transparent',
            boxShadow: 'none',
        },
        dark: {
            background: 'var(--color-text-primary)',
            color: '#fff',
            border: '1px solid transparent',
            boxShadow: 'var(--shadow-medium)',
        },
    };

    const s = styles[variant] || styles.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 22px 10px 22px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'opacity 0.15s, box-shadow 0.15s, transform 0.1s',
                whiteSpace: 'nowrap',
                ...s,
            }}
            onMouseEnter={e => {
                if (!disabled) {
                    e.currentTarget.style.opacity = '0.88';
                    if (variant === 'primary') {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(192,68,42,0.35)';
                    }
                }
            }}
            onMouseLeave={e => {
                if (!disabled) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = s.boxShadow;
                }
            }}
            onMouseDown={e => {
                if (!disabled) e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={e => {
                if (!disabled) e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
            {children}
        </button>
    );
}