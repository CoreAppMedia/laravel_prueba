import React from 'react';

const LINKS = ['Reglamento', 'Equipos', 'Resultados', 'Estadísticas'];

export default function Footer() {
    return (
        <footer>
            {/* Banda tricolor superior — coherencia con header */}
            <div className="brand-bar" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Identidad */}
                    <div>
                        <br />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="brand-logo" style={{ width: 60, height: 60 }}>
                                <img src="/images/logo.png" alt="Logo" />
                            </div>
                            <span className="text-display-md">
                                Liga Santiago Zapotitlán
                            </span>
                        </div>
                        <p className="text-body-md">
                            La liga municipal de fútbol que une pasión, comunidad y deporte en el corazón de México.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <br />
                        <div className="text-display-md">
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
                        <br />
                        <div className="text-display-md">
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
                                clubesunidoszapotitlan@gmail.com
                            </a>
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 13,
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                Santiago Zapotitlán, Tlahuac, CDMX.
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
                        © {new Date().getFullYear()} Liga Clubes Unidos Zapotitlán · Todos los derechos reservados.
                    </span>
                </div>
            </div>
        </footer>
    );
}