import React, { useState, useEffect } from 'react';
import http from '../../../lib/http';
import BasePanel from '../BasePanel';
import { Calendar, Trophy, Shield, Users, ChevronRight, Menu, X } from 'lucide-react';

// Importar componentes content-only de cada sección
import TemporadasContent from './Temporadas/TemporadasContent';
import TorneosContent from './Torneos/TorneosContent';
import ClubesContent from './Clubes/ClubesContent';
import EquiposContent from './Equipos/EquiposContent';
import CanchasContent from './Canchas/CanchasContent';
import ArbitrosContent from './Torneos/ArbitrosContent';
import UsersContent from './Users/UsersContent';
import FinanzasContent from './Finanzas/FinanzasContent';
import DirectivosContent from './Directivos/DirectivosContent';
import { MapPin, ShieldCheck, Banknote, Briefcase } from 'lucide-react';
import { useAuth } from '../../../Auth/AuthContext';

export default function PanelAdmin() {
    const { user } = useAuth();
    const canManageUsers = ['admin', 'desarrollador'].includes(user?.permiso?.nombre);
    const [stats, setStats] = useState({
        temporadas: 0,
        torneos: 0,
        clubes: 0,
        equipos: 0,
        canchas: 0,
        arbitros: 0,
        finanzas: 0,
        directivos: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);
    
    // Estado para la pestaña activa - Torneos por defecto
    const [activeTab, setActiveTab] = useState('torneos');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Usamos Promise.all con catch individual para que un fallo no bloquee todo
                const [resTemp, resTor, resClub, resEqui, resCanchas, resArbitros, resMultas, resDirectivos, resUsers] = await Promise.all([
                    http.get('/api/temporadas').catch(() => ({ data: [] })),
                    http.get('/api/torneos').catch(() => ({ data: [] })),
                    http.get('/api/clubs').catch(() => ({ data: [] })),
                    http.get('/api/equipos').catch(() => ({ data: [] })),
                    http.get('/api/canchas').catch(() => ({ data: [] })),
                    http.get('/api/arbitros').catch(() => ({ data: [] })),
                    http.get('/api/multas').catch(() => ({ data: [] })),
                    http.get('/api/directivos').catch(() => ({ data: [] })),
                    canManageUsers ? http.get('/api/users').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                ]);

                setStats({
                    temporadas: resTemp.data?.length || 0,
                    torneos: resTor.data?.length || 0,
                    clubes: resClub.data?.length || 0,
                    equipos: resEqui.data?.length || 0,
                    canchas: resCanchas.data?.length || 0,
                    arbitros: resArbitros.data?.length || 0,
                    finanzas: resMultas.data?.length || 0,
                    directivos: resDirectivos.data?.length || 0,
                    users: resUsers.data?.length || 0,
                });
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [canManageUsers]);

    // Menú en el orden especificado: Temporadas, Torneos, Clubes, Equipos
    const menuItems = [
        {
            id: 'temporadas',
            title: 'Temporadas',
            path: '/panel/admin/temporadas',
            icon: Calendar,
            color: 'var(--color-slate)',
            bg: 'var(--color-slate-light)',
            desc: 'Configuración de periodos de liga y fechas generales.',
            count: stats.temporadas
        },
        {
            id: 'torneos',
            title: 'Torneos',
            path: '/panel/admin/torneos',
            icon: Trophy,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-light)',
            desc: 'Gestión de ligas, copas y sus categorías.',
            count: stats.torneos
        },
        {
            id: 'clubes',
            title: 'Clubes',
            path: '/panel/admin/clubes',
            icon: Shield,
            color: 'var(--color-terra)',
            bg: 'var(--color-terra-light)',
            desc: 'Administración de organizaciones y sedes.',
            count: stats.clubes
        },
        {
            id: 'equipos',
            title: 'Equipos',
            path: '/panel/admin/equipos',
            icon: Users,
            color: 'var(--color-sage)',
            bg: 'var(--color-sage-light)',
            desc: 'Control de plantillas registradas por categoría.',
            count: stats.equipos
        },
        {
            id: 'canchas',
            title: 'Sedes (Canchas)',
            path: '/panel/admin/canchas',
            icon: MapPin,
            color: '#6D28D9',
            bg: '#F3E8FF',
            desc: 'Catálogo de campos, ubicaciones y horarios.',
            count: stats.canchas
        },
        {
            id: 'arbitros',
            title: 'Cuerpo Arbitral',
            path: '/panel/admin/arbitros',
            icon: ShieldCheck,
            color: '#10B981',
            bg: '#ECFDF5',
            desc: 'Catálogo oficial de árbitros y jueces de línea.',
            count: stats.arbitros
        },
        {
            id: 'finanzas',
            title: 'Finanzas',
            path: '/panel/admin/finanzas',
            icon: Banknote,
            color: '#059669',
            bg: '#D1FAE5',
            desc: 'Control de multas, ingresos y egresos del torneo.',
            count: stats.finanzas
        },
        {
            id: 'directivos',
            title: 'Directivos',
            path: '/panel/admin/directivos',
            icon: Briefcase,
            color: '#DB2777', // Pink 600
            bg: '#FCE7F3', // Pink 100
            desc: 'Directorio de Dueños y Delegados de los equipos.',
            count: stats.directivos
        },
        ...(canManageUsers
            ? [
                {
                    id: 'users',
                    title: 'Usuarios',
                    path: '/panel/admin/users',
                    icon: Users,
                    color: 'var(--color-slate)',
                    bg: 'var(--color-slate-light)',
                    desc: 'Gestión de cuentas, permisos y acceso.',
                    count: stats.users,
                },
            ]
            : []),
    ];

    const renderContent = () => {
        // Renderizar el componente correspondiente según la pestaña activa
        switch (activeTab) {
            case 'temporadas':
                return <TemporadasContent />;
            case 'torneos':
                return <TorneosContent />;
            case 'clubes':
                return <ClubesContent />;
            case 'equipos':
                return <EquiposContent />;
            case 'canchas':
                return <CanchasContent />;
            case 'arbitros':
                return <ArbitrosContent />;
            case 'finanzas':
                return <FinanzasContent />;
            case 'directivos':
                return <DirectivosContent />;
            case 'users':
                return <UsersContent />;
            default:
                return <TorneosContent />;
        }
    };

    return (
        <BasePanel titulo="Panel de Administración">
            <div className="panel-admin__topbar">
                <button
                    type="button"
                    className="panel-admin__menuBtn"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Abrir menú"
                >
                    <Menu size={16} />
                </button>
                <div
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                    }}
                >
                    Gestión
                </div>
            </div>

            <div
                className={`panel-admin__overlay ${isMenuOpen ? 'is-open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <div className="panel-admin__layout" style={{ display: 'flex', gap: '24px', minHeight: '600px', width: '100%' }}>
                {/* Menú lateral izquierdo */}
                <div
                    className={`panel-admin__sidebar ${isMenuOpen ? 'is-open' : ''}`}
                    style={{ 
                    width: '280px', 
                    flexShrink: 0,
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    height: 'fit-content'
                }}>
                    <h3 style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontSize: '16px', 
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0 0 16px 0',
                        padding: '0 12px 12px 12px',
                        borderBottom: '1px solid var(--color-border-subtle)'
                    }}>
                        Gestión
                    </h3>

                    <div className="panel-admin__topbar" style={{ marginBottom: 12 }}>
                        <button
                            type="button"
                            className="panel-admin__menuBtn"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMenuOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px 12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        backgroundColor: isActive ? item.bg : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        textAlign: 'left',
                                        width: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: isActive ? item.color : item.bg,
                                        color: isActive ? '#fff' : item.color,
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '14px',
                                            fontWeight: isActive ? 700 : 600,
                                            color: isActive ? item.color : 'var(--color-text-primary)'
                                        }}>
                                            {item.title}
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '11px',
                                            color: 'var(--color-text-muted)',
                                            marginTop: '2px'
                                        }}>
                                            {loading ? '...' : `${item.count} registros`}
                                        </div>
                                    </div>
                                    {isActive && (
                                        <ChevronRight size={18} color={item.color} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Resumen del sistema */}
                    <div style={{ 
                        marginTop: '24px',
                        padding: '16px 12px',
                        backgroundColor: 'var(--color-bg-muted)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle)'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: 'var(--color-text-muted)',
                            marginBottom: '12px'
                        }}>
                            Resumen del Sistema
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Estado API</span>
                                <span style={{ 
                                    fontFamily: 'var(--font-body)', 
                                    fontSize: '11px', 
                                    fontWeight: 600,
                                    color: 'var(--color-sage)',
                                    backgroundColor: 'var(--color-sage-light)',
                                    padding: '2px 8px',
                                    borderRadius: '12px'
                                }}>Estable</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total registros</span>
                                <span style={{ 
                                    fontFamily: 'var(--font-display)', 
                                    fontSize: '14px', 
                                    fontWeight: 700,
                                    color: 'var(--color-text-primary)'
                                }}>
                                    {loading ? '...' : stats.temporadas + stats.torneos + stats.clubes + stats.equipos + stats.arbitros + stats.finanzas + stats.directivos}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área de contenido principal */}
                <div style={{ flex: 1, width: '100%', minWidth: '0' }}>
                    {renderContent()}
                </div>
            </div>
        </BasePanel>
    );
}
