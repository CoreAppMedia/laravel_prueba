import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import http from '../../../lib/http';

export default function PanelAdminOverview() {
    const { loading: modulesLoading, menuItems } = useOutletContext();
    const [torneos, setTorneos] = useState([]);
    const [loadingTorneos, setLoadingTorneos] = useState(true);

    useEffect(() => {
        const fetchTorneos = async () => {
            try {
                const response = await http.get('/api/torneos');
                const allTorneos = response.data?.data || response.data;
                const active = allTorneos.filter(t => t.estatus === 'En Curso' || t.estatus === 'En Inscripción');
                setTorneos(active);
            } catch (error) {
                console.error("Error fetching torneos:", error);
            } finally {
                setLoadingTorneos(false);
            }
        };
        fetchTorneos();
    }, []);

    return (
        <div className="animate-fade-in-up">
            <style>{`
                .dashboard-card-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-premium) !important;
                    border-color: rgba(0,0,0,0.05) !important;
                }
                .dashboard-card-hover:hover .hover-scale-bg {
                    transform: scale(1.5);
                    opacity: 0.8 !important;
                }
                .dashboard-card-hover:hover .hover-slide-arrow {
                    transform: translateX(4px);
                }
            `}</style>
            
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                    Panel de Control General
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '16px' }}>
                    Selecciona un torneo activo para gestionarlo rápidamente, o accede a un módulo específico.
                </p>
            </div>

            {/* Accesos Rápidos a Torneos Activos */}
            <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-slate)' }}>
                        Torneos Activos
                    </h2>
                    <Link to="/panel/admin/torneos" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-terra)', textDecoration: 'none' }} className="hover:underline">
                        Ver todos →
                    </Link>
                </div>

                {loadingTorneos ? (
                    <div className="animate-pulse" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ height: '140px', background: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-xl)' }} />
                        ))}
                    </div>
                ) : torneos.length === 0 ? (
                    <div style={{ padding: '32px', background: 'var(--color-bg-surface)', border: '1px dashed var(--color-border-strong)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
                        <Trophy size={32} className="mx-auto text-slate-300 mb-3" />
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 700 }}>No hay torneos activos en este momento.</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>Ve al módulo de Torneos para iniciar uno nuevo.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {torneos.map(torneo => (
                            <Link 
                                key={torneo.id}
                                to={`/panel/admin/torneos/${torneo.id}`}
                                className="dashboard-card-hover group"
                                style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    background: 'var(--color-bg-surface)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '24px',
                                    boxShadow: 'var(--shadow-soft)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{
                                        backgroundColor: torneo.estatus === 'En Curso' ? 'var(--color-sage-light)' : 'var(--color-gold-light)',
                                        color: torneo.estatus === 'En Curso' ? 'var(--color-sage)' : 'var(--color-gold)',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        {torneo.estatus}
                                    </div>
                                    <div style={{ backgroundColor: 'var(--color-bg-main)', borderRadius: '50%', padding: '6px', color: 'var(--color-text-secondary)' }}>
                                        <ArrowRight size={14} className="hover-slide-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-terra)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                                    {torneo.temporada?.nombre || 'General'}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: '16px' }}>
                                    {torneo.nombre}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                                    <Trophy size={14} className="text-orange-400" />
                                    <span className="truncate">{torneo.tipo?.nombre || 'General'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-slate)' }}>
                    Módulos Generales
                </h2>
            </div>

            {modulesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }}></div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.id} 
                                to={item.path}
                                className="dashboard-card-hover"
                                style={{
                                    textDecoration: 'none',
                                    display: 'block',
                                    background: 'var(--color-bg-surface)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '32px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-soft)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {/* Decorative Gradient Blob */}
                                <div 
                                    className="hover-scale-bg"
                                    style={{
                                        position: 'absolute',
                                        top: '-40px',
                                        right: '-40px',
                                        width: '160px',
                                        height: '160px',
                                        borderRadius: '50%',
                                        background: `radial-gradient(circle, ${item.bg} 0%, transparent 70%)`,
                                        opacity: 0.4,
                                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        zIndex: 0
                                    }} 
                                />

                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '18px',
                                        backgroundColor: item.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: item.color,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                                    }}>
                                        <Icon size={32} strokeWidth={2} />
                                    </div>
                                    
                                    <div style={{
                                        backgroundColor: 'var(--color-bg-main)',
                                        padding: '8px 14px',
                                        borderRadius: '9999px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.2px',
                                        border: '1px solid var(--color-border-subtle)'
                                    }}>
                                        Gestionar
                                        <ArrowRight size={14} className="hover-slide-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                    </div>
                                </div>

                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    <div style={{ 
                                        fontFamily: 'var(--font-body)', 
                                        fontSize: '13px', 
                                        fontWeight: 800, 
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px'
                                    }}>
                                        {item.title}
                                    </div>
                                    <div style={{ 
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '12px'
                                    }}>
                                        <span style={{ 
                                            fontFamily: 'var(--font-display)', 
                                            fontSize: '48px', 
                                            fontWeight: 800, 
                                            color: 'var(--color-text-primary)',
                                            lineHeight: 1,
                                            letterSpacing: '-1.5px'
                                        }}>
                                            {item.count}
                                        </span>
                                        {item.count === '-' && (
                                            <span style={{ fontSize: '14px', color: 'var(--color-text-ghost)', fontWeight: 600 }}>Próximamente</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
