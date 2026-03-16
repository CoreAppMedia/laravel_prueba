import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import EquiposInscritos from './EquiposInscritos';
import JornadasManager from './JornadasManager';
import { Users, CalendarDays, Activity, Settings, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../Auth/AuthContext';
import { getHomePathForUser } from '../../../../lib/permissions';

export default function TorneoDashboard() {
    const { id } = useParams();
    const { user } = useAuth();
    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jornadas');

    useEffect(() => {
        const fetchTorneoInfo = async () => {
            setLoading(true);
            try {
                const response = await http.get(`/api/torneos/${id}`);
                setTorneo(response.data);
            } catch (error) {
                toast.error('Error al cargar la información del torneo');
            } finally {
                setLoading(false);
            }
        };

        fetchTorneoInfo();
    }, [id]);

    if (loading) {
        return (
            <BasePanel titulo="Cargando Torneo..." backUrl="/panel/admin/torneos">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', flexDirection: 'column', gap: '20px' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }}></div>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', fontSize: '14px', fontStyle: 'italic' }}>Consultando base de datos oficial...</span>
                </div>
            </BasePanel>
        );
    }

    if (!torneo) {
        return (
            <BasePanel titulo="Torneo no encontrado" backUrl="/panel/admin/torneos">
                <Card>
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                        No se pudo cargar la información de este torneo. Por favor, verifica el ID.
                    </div>
                </Card>
            </BasePanel>
        );
    }

    const tabs = [
        { id: 'resumen', name: 'Resumen General', icon: Activity },
        { id: 'equipos', name: 'Plantilla de Equipos', icon: Users },
        { id: 'jornadas', name: 'Calendario y Jornadas', icon: CalendarDays },
        { id: 'configuracion', name: 'Preferencias', icon: Settings },
    ];

    return (
        <BasePanel titulo={`${torneo.nombre}`} backUrl="/panel/admin/torneos">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                <Link
                    to={getHomePathForUser(user)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle)',
                        background: 'var(--color-bg-surface)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: 'var(--shadow-soft)',
                        textDecoration: 'none',
                    }}
                >
                    <ArrowLeft size={16} />
                    Volver a mi Panel
                </Link>
            </div>
            {/* Nav Pestañas Premium */}
            <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', marginBottom: '32px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--color-border-subtle)', scrollbarWidth: 'none' }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    flex: 1,
                                    minWidth: '160px',
                                    padding: '20px 24px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-body)',
                                    backgroundColor: isActive ? 'var(--color-bg-surface-alt)' : 'transparent',
                                    color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                    position: 'relative',
                                    borderBottom: isActive ? '3px solid var(--color-gold)' : '3px solid transparent'
                                }}
                            >
                                <Icon size={18} style={{ color: isActive ? 'var(--color-gold)' : 'inherit', transition: 'all 0.3s' }} />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Inyección de Contenido dinámico */}
            <div className="animate-fade-in-up">
                {activeTab === 'resumen' && (
                    <Card title="Estado de Operación del Torneo">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 16,
                                padding: '18px 18px',
                                background: 'linear-gradient(180deg, var(--color-bg-surface-alt), var(--color-bg-surface))',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.6px',
                                        color: 'var(--color-text-muted)',
                                    }}>
                                        Resumen ejecutivo
                                    </div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 22,
                                        fontWeight: 700,
                                        letterSpacing: '-0.2px',
                                        color: 'var(--color-text-primary)',
                                        lineHeight: 1.1,
                                    }}>
                                        {torneo.nombre}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginTop: 2,
                                    }}>
                                        <span className={`status-pill ${torneo.estatus === 'En Inscripción' || torneo.estatus === 'En Inscripcion' ? 'active' : (torneo.estatus === 'En Curso' ? 'pending' : 'finished')}`}>
                                            <span className="status-dot" />
                                            {torneo.estatus || 'Sin estatus'}
                                        </span>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '6px 10px',
                                            borderRadius: 999,
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: 'var(--color-text-secondary)',
                                            background: 'var(--color-bg-surface)',
                                            border: '1px solid var(--color-border-subtle)',
                                        }}>
                                            Temporada: {torneo.temporada?.nombre || 'General'}
                                        </span>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '6px 10px',
                                            borderRadius: 999,
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: 'var(--color-text-secondary)',
                                            background: 'var(--color-bg-surface)',
                                            border: '1px solid var(--color-border-subtle)',
                                        }}>
                                            Tipo: {torneo.tipo?.nombre || 'General'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                    gap: 10,
                                    minWidth: 260,
                                }}>
                                    <div style={{
                                        padding: '12px 12px',
                                        backgroundColor: 'var(--color-bg-surface)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)',
                                        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
                                    }}>
                                        <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Inicio</div>
                                        <div style={{ marginTop: 4, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-slate)' }}>{torneo.fecha_inicio}</div>
                                    </div>
                                    <div style={{
                                        padding: '12px 12px',
                                        backgroundColor: 'var(--color-bg-surface)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-subtle)',
                                        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)',
                                    }}>
                                        <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Fin</div>
                                        <div style={{ marginTop: 4, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-slate)' }}>{torneo.fecha_fin}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                                <div style={{ padding: '18px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Categoría</div>
                                    <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-sage)' }}>{torneo.categoria?.nombre || 'General'}</div>
                                </div>
                                <div style={{ padding: '18px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Inscripción</div>
                                    <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>${torneo.costo_inscripcion} MXN</div>
                                    <div style={{ marginTop: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)' }}>Costo base por equipo</div>
                                </div>
                                <div style={{ padding: '18px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Arbitraje</div>
                                    <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-terra)' }}>${torneo.costo_arbitraje_por_partido} MXN</div>
                                    <div style={{ marginTop: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)' }}>Por partido</div>
                                </div>
                                <div style={{ padding: '18px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Inscripción abierta</div>
                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: torneo.es_abierto ? 'var(--color-sage)' : 'var(--color-text-muted)' }}>
                                            {torneo.es_abierto ? 'Sí' : 'No'}
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: 10,
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            padding: '4px 10px',
                                            borderRadius: 999,
                                            border: '1px solid var(--color-border-subtle)',
                                            background: torneo.es_abierto ? 'var(--color-sage-light)' : 'var(--color-bg-surface)',
                                            color: torneo.es_abierto ? 'var(--color-sage)' : 'var(--color-text-muted)',
                                        }}>
                                            {torneo.es_abierto ? 'Inscripciones activas' : 'Cerrado'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'equipos' && (
                    <EquiposInscritos torneo={torneo} />
                )}

                {activeTab === 'jornadas' && (
                    <JornadasManager torneo={torneo} />
                )}

                {activeTab === 'configuracion' && (
                    <Card title="Ajustes de Competencia">
                        <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                            <Settings size={48} style={{ color: 'var(--color-text-muted)', opacity: 0.3, marginBottom: '16px' }} />
                            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Las opciones avanzadas estarán disponibles al cerrar la fase de inscripción.</p>
                        </div>
                    </Card>
                )}
            </div>
        </BasePanel>
    );
}
