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
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mx-green"></div>
                </div>
            </BasePanel>
        );
    }

    if (!torneo) {
        return (
            <BasePanel titulo="Torneo no encontrado" backUrl="/panel/admin/torneos">
                <Card>
                    <div className="text-center py-10 text-slate-500">
                        No se pudo cargar la información de este torneo.
                    </div>
                </Card>
            </BasePanel>
        );
    }

    const tabs = [
        { id: 'resumen', name: 'Resumen', icon: Activity },
        { id: 'equipos', name: 'Equipos Inscritos', icon: Users },
        { id: 'jornadas', name: 'Jornadas y Partidos', icon: CalendarDays },
        { id: 'configuracion', name: 'Configuración', icon: Settings },
    ];

    return (
        <BasePanel titulo={`Dashboard: ${torneo.nombre}`} backUrl="/panel/admin/torneos">
            {/* Header / Tabs Nav */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-soft mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row border-b border-slate-100">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center gap-2 flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-all ${
                                    isActive
                                        ? 'bg-slate-50 text-mx-green border-b-2 border-mx-green'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                <Icon size={18} />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in-up">
                {activeTab === 'resumen' && (
                    <Card title="Resumen del Torneo">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Torneo Info Summary */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Estatus</div>
                                <div className="text-lg font-black text-slate-900">{torneo.estatus || 'Sin estatus'}</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Categoría</div>
                                <div className="text-lg font-black text-slate-900">{torneo.categoria?.nombre || 'General'}</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Costo Inscripción</div>
                                <div className="text-lg font-black text-slate-900">${torneo.costo_inscripcion}</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Inicio</div>
                                <div className="text-lg font-black text-slate-900">{torneo.fecha_inicio}</div>
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
                    <Card title="Configuración Adicional">
                        <p className="text-slate-500 italic py-10 text-center">Opciones de configuración del torneo.</p>
                    </Card>
                )}
            </div>
        </BasePanel>
    );
}
