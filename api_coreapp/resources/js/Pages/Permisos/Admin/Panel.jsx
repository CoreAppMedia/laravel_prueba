import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../../../lib/http';
import BasePanel from '../BasePanel';
import { Calendar, Trophy, Shield, Users, Activity, TrendingUp, ArrowRight } from 'lucide-react';

export default function PanelAdmin() {
    const [stats, setStats] = useState({
        temporadas: 0,
        torneos: 0,
        clubes: 0,
        equipos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resTemp, resTor, resClub, resEqui] = await Promise.all([
                    http.get('/api/temporadas'),
                    http.get('/api/torneos'),
                    http.get('/api/clubs'),
                    http.get('/api/equipos'),
                ]);
                setStats({
                    temporadas: resTemp.data.length,
                    torneos: resTor.data.length,
                    clubes: resClub.data.length,
                    equipos: resEqui.data.length,
                });
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const modules = [
        {
            title: 'Temporadas',
            path: '/panel/admin/temporadas',
            icon: Calendar,
            color: 'var(--color-slate)',
            bg: 'var(--color-slate-light)',
            desc: 'Configuración de periodos de liga y fechas generales.',
            count: stats.temporadas
        },
        {
            title: 'Torneos',
            path: '/panel/admin/torneos',
            icon: Trophy,
            color: 'var(--color-gold)',
            bg: 'var(--color-gold-light)',
            desc: 'Gestión de ligas, copas y sus categorías.',
            count: stats.torneos
        },
        {
            title: 'Clubes',
            path: '/panel/admin/clubes',
            icon: Shield,
            color: 'var(--color-terra)',
            bg: 'var(--color-terra-light)',
            desc: 'Administración de organizaciones y sedes.',
            count: stats.clubes
        },
        {
            title: 'Equipos',
            path: '/panel/admin/equipos',
            icon: Users,
            color: 'var(--color-sage)',
            bg: 'var(--color-sage-light)',
            desc: 'Control de plantillas registradas por categoría.',
            count: stats.equipos
        },
    ];

    return (
        <BasePanel titulo="Gestion de operaciones">
<br />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                        <Link key={idx} to={mod.path} className="block group" style={{ textDecoration: 'none' }}>
                            <div
                                style={{
                                    height: '100%',
                                    backgroundColor: 'var(--color-bg-surface)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '28px 24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: 'var(--shadow-soft)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        backgroundColor: mod.bg,
                                        color: mod.color,
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 16,
                                    }}
                                >
                                    <Icon size={28} />
                                </div>

                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>{mod.title}</h3>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', lineHeight: 1.4, marginBottom: 24 }}>
                                    {mod.desc}
                                </p>

                                {/* Action footer */}
                                <div style={{ marginTop: 'auto', width: '100%', paddingTop: 16, borderTop: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-ghost)' }}>Registros</span>
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: mod.color }}>{loading ? '...' : mod.count}</span>
                                    </div>
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-bg-surface-alt)',
                                            border: '1px solid var(--color-border-subtle)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <br />

                        {/* Stats Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ width: 48, height: 48, backgroundColor: 'var(--color-slate-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', color: 'var(--color-text-muted)' }}>Crecimiento</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>Activo</div>
                    </div>
                </div>
                <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ width: 48, height: 48, backgroundColor: 'var(--color-sage-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-sage)' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', color: 'var(--color-text-muted)' }}>Estado API</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>Estable</div>
                    </div>
                </div>
                <div className="md:col-span-2" style={{ background: 'linear-gradient(135deg, var(--color-slate) 0%, #1a2533 100%)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-premium)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)' }}>Panel de Administración</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', fontWeight: 700, marginTop: 4 }}>Gestiona tu liga de fútbol con elegancia.</div>
                    </div>
                    <Trophy size={60} style={{ color: 'rgba(255,255,255,0.05)', position: 'absolute', right: -10, top: -10 }} />
                </div>
            </div>

            {/* Bottom Alert Section */}
            <section style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center', gap: 24, padding: '32px' }}>
                <div style={{ width: 64, height: 64, backgroundColor: 'var(--color-gold-light)', color: 'var(--color-gold)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={32} />
                </div>
                <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0 }}>Consejo del Desarrollador</h5>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-secondary)', margin: '8px 0 0 0', lineHeight: 1.6 }}>
                        Recuerda que los cambios en las <strong>Temporadas</strong> afectan el calendario de todos los torneos vinculados. Realiza modificaciones con precaución durante la temporada activa.
                    </p>
                </div>
                <Link to="/panel/admin/temporadas" style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        Revisar Calendario
                    </button>
                </Link>
            </section>
        </BasePanel>
    );
}
