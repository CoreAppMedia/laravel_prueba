import React from 'react';

const LINKS = ['Reglamento', 'Equipos', 'Resultados', 'Estadísticas'];

export default function Footer() {
    return (
        <footer
            style={{
                background: 'var(--color-bg-surface)',
                borderTop: '1px solid var(--color-border-subtle)',
                marginTop: 'auto',
            }}
        >
            {/* Banda tricolor superior — coherencia con header */}
            <div className="brand-bar" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Identidad */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="brand-logo" style={{ width: 32, height: 32 }}>
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.5" />
                                    <path d="M10 2 L12 7.5 H18 L13.5 11 L15.5 17 L10 13.5 L4.5 17 L6.5 11 L2 7.5 H8 Z" fill="#fff" opacity=".85" />
                                </svg>
                            </div>
                            <span
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                Liga Santiago Zapotitlán
                            </span>
                        </div>
                        <p
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                color: 'var(--color-text-muted)',
                                lineHeight: 1.65,
                                maxWidth: 260,
                            }}
                        >
                            La liga municipal de fútbol que une pasión, comunidad y deporte en el corazón de México.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <div className="text-label" style={{ marginBottom: 16 }}>
                            Enlaces rápidos
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {LINKS.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: 'var(--color-text-secondary)',
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            transition: 'color 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-terra)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: 4,
                                                height: 4,
                                                borderRadius: '50%',
                                                background: 'var(--color-border-strong)',
                                                flexShrink: 0,
                                            }}
                                        />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <div className="text-label" style={{ marginBottom: 16 }}>
                            Contacto
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <a
                                href="mailto:info@clubesunidos.com"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-terra)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                            >
                                info@clubesunidos.com
                            </a>
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                Santiago Zapotitlán, CDMX
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cierre */}
                <div
                    style={{
                        marginTop: 40,
                        paddingTop: 24,
                        borderTop: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 11,
                            color: 'var(--color-text-ghost)',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                        }}
                    >
                        © {new Date().getFullYear()} Liga Santiago Zapotitlán · Todos los derechos reservados.
                    </span>
                    <span
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 11,
                            color: 'var(--color-text-ghost)',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                        }}
                    >
                        Temporada 2025
                    </span>
                </div>
            </div>
        </footer>
    );
}