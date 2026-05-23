import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet } from 'react-router-dom';
import http from '../lib/http';
import BasePanel from '../Pages/Permisos/BasePanel';
import { useAuth } from '../Auth/AuthContext';
import { 
    Calendar, Trophy, Shield, Users, 
    MapPin, ShieldCheck, Banknote, Briefcase, CalendarDays 
} from 'lucide-react';

export default function AdminLayout() {
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
    const [portalContainer, setPortalContainer] = useState(null);

    useEffect(() => {
        setPortalContainer(document.getElementById('header-subbar-portal'));
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
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

                const getCount = (res) => res?.data?.total !== undefined ? res.data.total : (res?.data?.length || 0);

                setStats({
                    temporadas: getCount(resTemp),
                    torneos: getCount(resTor),
                    clubes: getCount(resClub),
                    equipos: getCount(resEqui),
                    canchas: getCount(resCanchas),
                    arbitros: getCount(resArbitros),
                    finanzas: getCount(resMultas),
                    directivos: getCount(resDirectivos),
                    users: getCount(resUsers),
                });
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [canManageUsers]);

    const menuItems = [
        {
            id: 'finanzas',
            title: 'Finanzas',
            path: '/panel/admin/finanzas',
            icon: Banknote,
            color: '#059669',
            bg: '#D1FAE5',
            count: stats.finanzas
        },
        {
            id: 'rol-de-juego',
            title: 'Programación',
            path: '/panel/admin/rol-de-juego',
            icon: CalendarDays,
            color: '#2563EB',
            bg: '#DBEAFE',
            count: '-'
        },
        {
            id: 'equipos',
            title: 'Equipos',
            path: '/panel/admin/equipos',
            icon: Users,
            color: 'var(--color-sage)',
            bg: 'var(--color-sage-light)',
            count: stats.equipos
        },
        {
            id: 'directivos',
            title: 'Directivos',
            path: '/panel/admin/directivos',
            icon: Briefcase,
            color: '#DB2777',
            bg: '#FCE7F3',
            count: stats.directivos
        },
        {
            id: 'temporadas',
            title: 'Temporadas',
            path: '/panel/admin/temporadas',
            icon: Calendar,
            color: 'var(--color-slate)',
            bg: 'var(--color-slate-light)',
            count: stats.temporadas
        },
        {
            id: 'torneos',
            title: 'Torneos',
            path: '/panel/admin/torneos',
            icon: Trophy,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-light)',
            count: stats.torneos
        },
        {
            id: 'clubes',
            title: 'Clubes',
            path: '/panel/admin/clubes',
            icon: Shield,
            color: 'var(--color-terra)',
            bg: 'var(--color-terra-light)',
            count: stats.clubes
        },
        {
            id: 'canchas',
            title: 'Sedes',
            path: '/panel/admin/canchas',
            icon: MapPin,
            color: '#6D28D9',
            bg: '#F3E8FF',
            count: stats.canchas
        },
        {
            id: 'arbitros',
            title: 'Cuerpo Arbitral',
            path: '/panel/admin/arbitros',
            icon: ShieldCheck,
            color: '#10B981',
            bg: '#ECFDF5',
            count: stats.arbitros
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
                    count: stats.users,
                },
            ]
            : []),
    ];

    const subNavbarContent = (
        <div style={{ 
            backgroundColor: 'transparent',
            paddingBottom: '16px',
            paddingTop: '0px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        }}>
            <div 
                style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto', 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                    padding: '0 24px' // Safe area for mobile scrolling
                }}
                className="no-scrollbar"
            >
                <div style={{
                    display: 'inline-flex',
                    backgroundColor: 'var(--color-bg-main)', // Gray interior
                    border: '1px solid var(--color-border-subtle)',
                    padding: '6px',
                    borderRadius: '9999px',
                    gap: '4px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            end={item.id === 'temporadas'} // Optional: handle exact matching if needed
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 20px',
                                borderRadius: '9999px',
                                backgroundColor: isActive ? item.bg : 'transparent',
                                color: isActive ? item.color : 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                border: isActive ? `1px solid ${item.color}` : '1px solid transparent',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: isActive ? 800 : 600,
                                fontSize: '13px',
                                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={16} style={{ flexShrink: 0 }} />
                                    <span>{item.title}</span>
                                    <span style={{
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.05)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        marginLeft: '2px'
                                    }}>
                                        {loading ? '...' : item.count}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );

    return (
        <BasePanel titulo="Administración de Liga">
            {portalContainer && createPortal(subNavbarContent, portalContainer)}

            <div style={{ minHeight: '600px', paddingTop: '0px' }}>
                <Outlet context={{ stats, loading, menuItems }} />
            </div>
        </BasePanel>
    );
}
