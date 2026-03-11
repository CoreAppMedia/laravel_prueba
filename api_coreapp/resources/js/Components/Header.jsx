import React, { useState } from 'react';

const NAV_ITEMS = ['Inicio', 'Equipos', 'Calendario', 'Estadísticas', 'Noticias'];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="app-header">
            {/* Banda tricolor de marca — firma visual del sistema */}
            <div className="brand-bar-thick" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="app-header-inner">

                    {/* Identidad */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="brand-logo">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.5" />
                                <path
                                    d="M10 2 L12 7.5 H18 L13.5 11 L15.5 17 L10 13.5 L4.5 17 L6.5 11 L2 7.5 H8 Z"
                                    fill="#fff"
                                    opacity=".85"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="brand-name">Liga Santiago Zapotitlán</div>
                            <div className="brand-season">Temporada 2025</div>
                        </div>
                    </div>

                    {/* Navegación desktop */}
                    <nav className="hidden md:flex items-center">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="nav-tab"
                                style={{ borderBottom: '2px solid transparent' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Estado + menú móvil */}
                    <div className="flex items-center gap-4">
                        <div className="status-pill active hidden sm:inline-flex">
                            <span className="status-dot" />
                            Jornada 11
                        </div>

                        {/* Hamburger móvil */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md"
                            style={{ color: 'var(--color-text-muted)' }}
                            aria-label="Menú"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isMenuOpen && (
                <div
                    className="md:hidden animate-fade-in"
                    style={{
                        background: 'var(--color-bg-surface)',
                        borderTop: '1px solid var(--color-border-subtle)',
                        boxShadow: 'var(--shadow-medium)',
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={{
                                    display: 'block',
                                    padding: '11px 16px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: 'var(--color-text-secondary)',
                                    borderRadius: 'var(--radius-sm)',
                                    textDecoration: 'none',
                                    transition: 'background 0.15s, color 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--color-bg-surface-alt)';
                                    e.currentTarget.style.color = 'var(--color-terra)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }}
                            >
                                {item}
                            </a>
                        ))}

                        {/* Status en móvil */}
                        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border-subtle)', marginTop: 4 }}>
                            <div className="status-pill active" style={{ display: 'inline-flex' }}>
                                <span className="status-dot" />
                                En curso · Jornada 11
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}