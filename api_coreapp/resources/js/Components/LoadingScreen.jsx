import React from 'react';

export default function LoadingScreen({ label }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-bg-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 400,
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-medium)',
                }}
            >
                {/* Banda tricolor animada */}
                <div style={{ position: 'relative', height: 3, background: 'var(--color-bg-surface-alt)', overflow: 'hidden' }}>
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--gradient-brand)',
                            animation: 'loadingBar 1.6s ease-in-out infinite',
                            transformOrigin: 'left center',
                        }}
                    />
                </div>

                <div style={{ padding: '36px 32px 32px', textAlign: 'center' }}>
                    {/* Logo */}
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}
                    >
                        <div className="brand-logo">
                            <img src="/images/logo.png" alt="Logo" />
                        </div>
                    </div>

                    {/* Texto */}
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 20,
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            marginBottom: 8,
                            letterSpacing: '-0.3px',
                        }}
                    >
                        Liga Santiago Zapotitlán
                    </div>
                    <div
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            color: 'var(--color-text-muted)',
                            marginBottom: 28,
                        }}
                    >
                        {label || 'Preparando el panel…'}
                    </div>

                    {/* Puntos animados */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: i === 0
                                        ? 'var(--color-terra)'
                                        : i === 1
                                            ? 'var(--color-gold)'
                                            : 'var(--color-sage)',
                                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Keyframe local para la barra de progreso */}
            <style>{`
                @keyframes loadingBar {
                    0%   { transform: scaleX(0);   opacity: 1; }
                    60%  { transform: scaleX(1);   opacity: 1; }
                    100% { transform: scaleX(1);   opacity: 0; }
                }
            `}</style>
        </div>
    );
}