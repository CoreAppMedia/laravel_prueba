import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { User, ChevronDown, Shield, Mail, LogOut, LayoutDashboard } from 'lucide-react';

const NAV_ITEMS = ['Inicio', 'Equipos', 'Calendario', 'Estadísticas', 'Noticias'];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Determinar el panel según el permiso del usuario
    const permisoNombre = user?.permiso?.nombre?.toLowerCase() || '';
    const panelPath = permisoNombre ? `/panel/${permisoNombre.replace(/\s+/g, '-')}` : '/panel';
    const panelLabel = user?.permiso?.nombre ? `Panel ${user.permiso.nombre}` : 'Panel';

    return (
        <header className="app-header">
            {/* Banda tricolor de marca — firma visual del sistema */}
            <div className="brand-bar-thick" />

            {/* Menú de usuario - Siempre pegado a la derecha de la pantalla */}
            <div 
                style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '24px', 
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}
            >


                {/* Menú desplegable del usuario - Solo si está logueado */}
                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50/80 transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mx-green to-mx-red p-[1px]">
                                <div className="w-full h-full rounded-[6px] bg-white flex items-center justify-center">
                                    <User size={16} className="text-slate-700" />
                                </div>
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-semibold text-slate-900">
                                    {user?.nombre} {user?.apellido_paterno}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {user?.rol?.nombre || 'Administrador'}
                                </div>
                            </div>
                            <ChevronDown 
                                size={16} 
                                className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown del usuario */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-premium z-50 animate-fade-in overflow-hidden">
                                {/* Header del dropdown */}
                                <div className="bg-gradient-to-r from-mx-green/5 to-mx-red/5 border-b border-slate-100 p-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-center">
                                            <div className="font-bold text-slate-900 text-lg">
                                                {user?.nombre} {user?.apellido_paterno}
                                            </div>
                                            <div className="text-sm text-slate-500 font-medium">{user?.email}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Opciones del menú */}
                                <div className="p-4 space-y-3">
                                    <div 
                                        className="px-4 py-3 flex items-center gap-4 text-sm text-slate-600 rounded-full border border-slate-100 transition-all cursor-pointer group"
                                        style={{'--tw-hover-bg': 'var(--color-terra-light)'}}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-terra-light)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                                            <Shield size={18} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-slate-900">{user?.rol?.nombre || 'Administrador'}</div>
                                            <div className="text-xs text-slate-500">Rol actual</div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="px-4 py-3 flex items-center gap-4 text-sm text-slate-600 rounded-full border border-slate-100 transition-all cursor-pointer group"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-terra-light)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors flex-shrink-0">
                                            <Mail size={18} className="text-slate-600" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-slate-900 truncate">{user?.email}</div>
                                            <div className="text-xs text-slate-500">Correo electrónico</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón Panel Admin/Desarrollador */}
                                <div className="px-4 pb-2">
                                    <button 
                                        onClick={() => {
                                            navigate(panelPath);
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium rounded-full border transition-all cursor-pointer group"
                                        style={{
                                            color: 'var(--color-sage)',
                                            backgroundColor: 'var(--color-sage-light)',
                                            borderColor: 'rgba(58, 107, 82, 0.2)',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-sage)';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-sage-light)';
                                            e.currentTarget.style.color = 'var(--color-sage)';
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                                            <LayoutDashboard size={18} />
                                        </div>
                                        <span>{panelLabel}</span>
                                    </button>
                                </div>

                                {/* Footer con logout */}
                                <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                                    <button 
                                        onClick={signOut}
                                        className="w-full px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium text-red-600 rounded-full border border-red-100 transition-all group"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-terra-light)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                                            <LogOut size={18} />
                                        </div>
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Hamburger móvil */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-md"
                    style={{ color: 'var(--color-text-muted)', backgroundColor: 'rgba(255,255,255,0.7)' }}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative' }}>
                <div className="app-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Identidad - Clickable para ir al dashboard */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 cursor-pointer" style={{ width: '200px' }}>
                        <div className="brand-logo">
                            <img src="/images/logo.png" alt="Logo" />
                        </div>
                        <div>
                            <div className="brand-name">Liga Santiago Zapotitlán</div>
                            <div className="brand-season">Temporada 2026</div>
                        </div>
                    </Link>

                    {/* Navegación desktop - Centrada */}
                    <nav className="hidden md:flex items-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
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

                    {/* Spacer invisible para balancear el layout */}
                    <div style={{ width: '200px', flexShrink: 0 }} />
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