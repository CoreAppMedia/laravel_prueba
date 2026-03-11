import React from 'react';

export default function Card({ children, className = '', title }) {
    return (
        <div
            className={`animate-fade-in ${className}`}
            style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
            }}
        >
            {title && (
                <>
                    {/* Banda tricolor fina como firma de sección */}
                    <div className="brand-bar" />
                    <div
                        style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            background: 'var(--color-bg-surface-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <h3
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 16,
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                                letterSpacing: '-0.2px',
                                lineHeight: 1,
                            }}
                        >
                            {title}
                        </h3>
                    </div>
                </>
            )}
            <div style={{ padding: 24 }}>
                {children}
            </div>
        </div>
    );
}