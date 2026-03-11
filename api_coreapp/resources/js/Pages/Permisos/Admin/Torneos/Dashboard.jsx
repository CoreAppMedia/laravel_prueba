import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import EquiposInscritos from './EquiposInscritos';
import JornadasManager from './JornadasManager';
import { Users, CalendarDays, Activity, Settings, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TorneoDashboard() {
    const { id } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('resumen');

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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            {/* Torneo Info Summary */}
                            <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>Estatus Actual</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-slate)' }}>{torneo.estatus || 'Sin estatus'}</div>
                            </div>
                            <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>Categoría Oficial</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-sage)' }}>{torneo.categoria?.nombre || 'General'}</div>
                            </div>
                            <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>Inscripción Base</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>${torneo.costo_inscripcion} MXN</div>
                            </div>
                            <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>Fecha de Apertura</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-slate)' }}>{torneo.fecha_inicio}</div>
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
