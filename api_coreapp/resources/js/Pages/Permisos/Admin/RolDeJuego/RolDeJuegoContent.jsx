import React, { useState, useEffect, useRef } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { Calendar, Plus, CalendarDays, Check, Shield, Search, RefreshCw, FileText, Printer, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import JornadaGlobalPDFExport from '../../../../Components/JornadaGlobalPDFExport';

export default function RolDeJuegoContent() {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('sv-SE'));
    const [jornadasGlobales, setJornadasGlobales] = useState([]);
    const [selectedJornadaGlobalId, setSelectedJornadaGlobalId] = useState('');
    const [canchas, setCanchas] = useState([]);
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Mapeo de días para filtrar slots
    const dayMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }; // JS (0-6) a DB (1-7, 7=Dom)
    const selectedDayOfWeek = dayMap[new Date(selectedDate + 'T12:00:00').getDay()];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAperturaModalOpen, setIsAperturaModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const pdfRef = useRef(null);

    const [aperturaForm, setAperturaForm] = useState({
        nombre: '',
        fecha_juego: new Date().toLocaleDateString('sv-SE')
    });

    // Selectors state
    const [torneos, setTorneos] = useState([]);
    const [selectedTorneoId, setSelectedTorneoId] = useState('');
    const [jornadas, setJornadas] = useState([]);
    const [equipos, setEquipos] = useState([]);

    const [form, setForm] = useState({
        jornada_id: '',
        equipo_local_id: '',
        equipo_visitante_id: '',
        cancha_id: '',
        cancha_horario_id: '',
        fecha: '',
    });

    useEffect(() => {
        fetchJornadasGlobales();
        fetchTorneos();
    }, []);

    useEffect(() => {
        if (selectedJornadaGlobalId) {
            fetchData();
        }
    }, [selectedJornadaGlobalId, selectedDate]);

    const fetchJornadasGlobales = async () => {
        try {
            const res = await http.get('/api/jornadas-globales');
            setJornadasGlobales(res.data);
            if (res.data.length > 0 && !selectedJornadaGlobalId) {
                setSelectedJornadaGlobalId(res.data[0].id);
                // La fecha seleccionada será el Domingo de esa jornada
                setSelectedDate(res.data[0].fecha_fin);
            }
        } catch (error) {
            console.error('Error fetching global matchdays:', error);
        }
    };

    const selectedJG = jornadasGlobales.find(jg => jg.id === selectedJornadaGlobalId);

    const handlePrint = useReactToPrint({
        contentRef: pdfRef,
        documentTitle: `Rol_de_Juego_${selectedJG?.nombre || 'Global'}`,
        pageStyle: `
            @page {
                size: letter landscape;
                margin: 10mm 12mm;
            }
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        `,
    });

    // Al cambiar la jornada global seleccionada, actualizamos la fecha al Domingo de esa jornada
    useEffect(() => {
        if (selectedJG) {
            setSelectedDate(selectedJG.fecha_fin);
        }
    }, [selectedJornadaGlobalId]);

    useEffect(() => {
        // Polling silencioso cada 15 segundos para auto-sincronización
        const interval = setInterval(() => {
            fetchData(true);
        }, 15000);

        return () => clearInterval(interval);
    }, [selectedDate]);

    const fetchData = async (silent = false) => {
        if (!selectedJornadaGlobalId) return;
        if (!silent) setLoading(true);
        try {
            const [resCanchas, resPartidos] = await Promise.all([
                http.get(`/api/rol-de-juego/canchas-activas?fecha=${selectedDate}`),
                http.get(`/api/jornadas-globales/${selectedJornadaGlobalId}/partidos`)
            ]);
            setCanchas(resCanchas.data);
            // Mostrar todos los partidos de la jornada global (el grid filtra por cancha_id + cancha_horario_id)
            setPartidos(resPartidos.data);
        } catch (error) {
            if (!silent) toast.error('Error al cargar la programación.');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchTorneos = async () => {
        try {
            const res = await http.get('/api/torneos');
            setTorneos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Al seleccionar un torneo, cargamos sus jornadas y equipos inscritos
    // Pero filtramos SOLO las jornadas vinculadas a la Jornada Global activa
    useEffect(() => {
        if (!selectedTorneoId) {
            setJornadas([]);
            setEquipos([]);
            setForm(prev => ({ ...prev, jornada_id: '', equipo_local_id: '', equipo_visitante_id: '' }));
            return;
        }

        const fetchTorneoDetails = async () => {
            try {
                const [resJornadas, resEquipos] = await Promise.all([
                    http.get(`/api/torneos/${selectedTorneoId}/jornadas`),
                    http.get(`/api/torneos/${selectedTorneoId}/equipos-inscritos`)
                ]);

                // Solo mostrar jornadas no cerradas
                const jornadasAbiertas = resJornadas.data.filter(j => !j.cerrada);
                setJornadas(jornadasAbiertas);
                setEquipos(resEquipos.data);

                // Auto-seleccionar la jornada vinculada a esta Jornada Global
                // buscamos la que cuya fecha_inicio coincida con la JG seleccionada
                const jornadaVinculada = jornadasAbiertas.find(
                    j => j.fecha_inicio === selectedJG?.fecha_inicio
                );
                const autoJornada = jornadaVinculada || (jornadasAbiertas.length === 1 ? jornadasAbiertas[0] : null);

                setForm(prev => ({
                    ...prev,
                    jornada_id: autoJornada ? autoJornada.id : '',
                    equipo_local_id: '',
                    equipo_visitante_id: ''
                }));
            } catch (error) {
                toast.error('Error al cargar detalles del torneo.');
            }
        };

        fetchTorneoDetails();
    }, [selectedTorneoId]);

    // Equipos ya usados en la fecha seleccionada (Global)
    const usedTeamIdsInSelectedDate = new Set(
        partidos.flatMap(p => [p.equipo_local_id, p.equipo_visitante_id])
    );

    // Equipos ya usados en la JORNADA seleccionada en el modal
    const selectedJornada = jornadas.find(j => j.id === form.jornada_id);
    const usedTeamIdsInSelectedJornada = new Set(
        (selectedJornada?.partidos || []).flatMap(p => [p.equipo_local_id, p.equipo_visitante_id])
    );

    // Unión de ambos sets para el filtrado final
    const allUsedTeamIds = new Set([...usedTeamIdsInSelectedDate, ...usedTeamIdsInSelectedJornada]);

    const handleAperturaSubmit = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await http.post('/api/jornadas-globales', aperturaForm);
            toast.success(res.data.message);
            setIsAperturaModalOpen(false);
            fetchJornadasGlobales();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al aperturar jornada global.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDeletePartido = async (partidoId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este encuentro? Esta acción no se puede deshacer.')) return;
        try {
            await http.delete(`/api/partidos/${partidoId}`);
            toast.success('Encuentro eliminado correctamente.');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'No se pudo eliminar el encuentro.');
        }
    };

    const formatHora = (t) => (typeof t === 'string' ? t.substring(0, 5) : '');

    // Determinar si el encuentro es en sede neutral
    const equipoLocal = equipos.find(e => e.id === form.equipo_local_id);
    const equipoVisitante = equipos.find(e => e.id === form.equipo_visitante_id);
    const esSede = equipoLocal?.cancha_id === form.cancha_id || equipoVisitante?.cancha_id === form.cancha_id;
    const esNeutral = form.equipo_local_id && form.equipo_visitante_id && !esSede;
    const [neutralConfirmado, setNeutralConfirmado] = useState(false);

    // Limpiar confirmación al cambiar equipos
    useEffect(() => {
        setNeutralConfirmado(false);
    }, [form.equipo_local_id, form.equipo_visitante_id, form.cancha_id]);

    const handleAssignClick = (cancha, horario) => {
        setForm({
            jornada_id: '',
            equipo_local_id: '',
            equipo_visitante_id: '',
            cancha_id: cancha.id,
            cancha_horario_id: horario.id,
            fecha: `${selectedDate} ${horario.hora}`,
        });
        setSelectedTorneoId('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.jornada_id) return toast.error('Debe seleccionar una jornada');
        if (form.equipo_local_id === form.equipo_visitante_id) return toast.error('Los equipos deben ser diferentes');
        if (esNeutral && !neutralConfirmado) return toast.error('Debes confirmar que el encuentro se jugará en sede neutral.');

        setFormLoading(true);
        try {
            await http.post(`/api/jornadas/${form.jornada_id}/partidos`, {
                ...form
            });
            toast.success('Partido programado con éxito.');
            setIsModalOpen(false);
            fetchData(); // Recargar el grid
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al programar el partido.');
        } finally {
            setFormLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--color-text-primary)',
        outline: 'none'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Unified Header / Controls */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--color-slate)' }}>Rol de Juego Global</h2>
                        <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                            Visualiza y programa partidos de todos los torneos sin empalmar horarios.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={handlePrint}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--color-border-subtle)', background: 'white', cursor: 'pointer', 
                                fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)',
                                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <FileText size={18} style={{ color: 'var(--color-navy)' }} />
                            Vista Previa PDF
                        </button>
                        <GradientButton 
                            onClick={() => setIsAperturaModalOpen(true)} 
                            variant="primary" 
                        >
                            <Plus size={16} style={{ marginRight: '6px' }} />
                            Aperturar Jornada Global
                        </GradientButton>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'var(--color-bg-muted)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', flexWrap: 'wrap' }}>
                    {/* Selector de Jornada Global */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-navy-light)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CalendarDays size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jornada Activa</div>
                            <select
                                value={selectedJornadaGlobalId}
                                onChange={(e) => setSelectedJornadaGlobalId(e.target.value)}
                                style={{
                                    border: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: 'var(--color-slate)',
                                    cursor: 'pointer', padding: '2px 0', outline: 'none', width: '100%'
                                }}
                            >
                                {jornadasGlobales.length === 0 && <option value="">No hay jornadas activas</option>}
                                {jornadasGlobales.map(jg => (
                                    <option key={jg.id} value={jg.id}>{jg.nombre.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border-subtle)' }}></div>

                    <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar equipo o sede..."
                            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', outline: 'none' }}
                        />
                    </div>

                    <button
                        onClick={() => fetchData(false)}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}
                    >
                        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Sincronizar
                    </button>
                </div>
            </Card>

            {/* Grid de Canchas (Estilo PDF) */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px', gap: '20px' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }}></div>
                    <span style={{ fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sincronizando Rol de Juego...</span>
                </div>
            ) : canchas.filter(c => (c.horarios || []).some(h => h.dia_semana === selectedDayOfWeek)).length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border-subtle)' }}>
                    <Calendar size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-slate)', marginBottom: '8px' }}>Sin horarios definidos para este día</div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}> No se encontraron canchas con horarios activos para el día seleccionado. Intenta cambiar la fecha en el calendario superior.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {canchas.map(cancha => {
                        // Solo mostrar horarios que coincidan con el día de la semana seleccionado
                        const horariosFiltrados = (cancha.horarios || [])
                            .filter(h => h.dia_semana === selectedDayOfWeek)
                            .sort((a, b) => a.hora.localeCompare(b.hora));

                        if (horariosFiltrados.length === 0) return null;

                        return (
                            <div key={cancha.id} style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-bg-surface)' }}>
                                <div style={{
                                    padding: '12px', backgroundColor: 'var(--color-navy)', color: 'black',
                                    fontSize: '11px', fontWeight: 900, textTransform: 'uppercase',
                                    textAlign: 'center', borderBottom: '2px solid var(--color-gold)'
                                }}>
                                    {cancha.nombre}
                                </div>
                                {horariosFiltrados.map(horario => {
                                    const partido = partidos.find(p => p.cancha_id === cancha.id && p.cancha_horario_id === horario.id);

                                    return (
                                        <div key={horario.id} style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--color-border-subtle)' }}>
                                            {/* Hora */}
                                            <div style={{ padding: '12px', width: '70px', borderRight: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-slate)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                                                {formatHora(horario.hora)}
                                            </div>

                                            {/* Contenido / Encuentro */}
                                            <div style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {partido ? (
                                                    <div style={{ width: '100%' }}>
                                                        <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>
                                                            {partido.jornada?.torneo?.nombre || 'Torneo'} - J{partido.jornada?.numero}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                                            <div style={{ flex: 1, textAlign: 'right', fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '13px' }}>{partido.equipo_local?.nombre_mostrado}</div>
                                                            <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)' }}>VS</div>
                                                            <div style={{ flex: 1, textAlign: 'left', fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '13px' }}>{partido.equipo_visitante?.nombre_mostrado}</div>
                                                            <button
                                                                onClick={() => handleDeletePartido(partido.id)}
                                                                title="Eliminar encuentro"
                                                                style={{
                                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                                    color: '#ef4444', padding: '4px', borderRadius: '4px',
                                                                    display: 'flex', alignItems: 'center', flexShrink: 0,
                                                                    opacity: 0.6, transition: 'opacity 0.2s'
                                                                }}
                                                                onMouseOver={e => e.currentTarget.style.opacity = '1'}
                                                                onMouseOut={e => e.currentTarget.style.opacity = '0.6'}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssignClick(cancha, horario)}
                                                        style={{
                                                            width: '100%', padding: '8px', background: 'transparent', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-sm)',
                                                            color: 'var(--color-gold)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        <Plus size={14} /> Asignar Partido
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal para programar encuentro */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Programar Encuentro">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--color-bg-muted)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Fecha / Hora</span>
                            <div style={{ fontWeight: 700 }}>{selectedDate} a las {formatHora(form.fecha.split(' ')[1])}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase' }}>Torneo</label>
                        <select style={inputStyle} value={selectedTorneoId} onChange={e => setSelectedTorneoId(e.target.value)} required>
                            <option value="">-- Seleccionar Torneo --</option>
                            {torneos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase' }}>Jornada</label>
                        <select style={inputStyle} value={form.jornada_id} onChange={e => setForm({ ...form, jornada_id: e.target.value })} required disabled={!selectedTorneoId}>
                            <option value="">-- Seleccionar Jornada --</option>
                            {jornadas.map(j => <option key={j.id} value={j.id}>Jornada {j.numero}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}><Shield size={12} /> Local</label>
                            <select style={inputStyle} value={form.equipo_local_id} onChange={e => setForm({ ...form, equipo_local_id: e.target.value })} required disabled={!selectedTorneoId}>
                                <option value="">Seleccionar...</option>
                                {equipos.filter(e => !allUsedTeamIds.has(e.id) || e.id === form.equipo_local_id).map(e => (
                                    <option key={e.id} value={e.id}>{e.nombre_mostrado}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-gold)', marginTop: '20px' }}>VS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}><Shield size={12} /> Visitante</label>
                            <select style={inputStyle} value={form.equipo_visitante_id} onChange={e => setForm({ ...form, equipo_visitante_id: e.target.value })} required disabled={!selectedTorneoId}>
                                <option value="">Seleccionar...</option>
                                {equipos.filter(e => !allUsedTeamIds.has(e.id) || e.id === form.equipo_visitante_id).map(e => (
                                    <option key={e.id} value={e.id}>{e.nombre_mostrado}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Alerta de sede neutral */}
                    {esNeutral && (
                        <div style={{
                            backgroundColor: '#fffbeb',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ fontSize: '18px' }}>⚠️</span>
                                <div>
                                    <div style={{ fontWeight: 900, fontSize: '13px', color: '#92400e' }}>Sede Neutral Detectada</div>
                                    <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
                                        Ninguno de los equipos seleccionados tiene como sede local esta cancha.
                                        El encuentro se programará en <strong>cancha neutral</strong>.
                                    </div>
                                </div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
                                <input
                                    type="checkbox"
                                    checked={neutralConfirmado}
                                    onChange={e => setNeutralConfirmado(e.target.checked)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                Confirmo que este encuentro se jugará en sede neutral
                            </label>
                        </div>
                    )}

                    {/* Indicador de sede confirmada */}
                    {esSede && form.equipo_local_id && form.equipo_visitante_id && (
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #22c55e',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#15803d'
                        }}>
                            ✅ Encuentro en sede local de {equipoLocal?.cancha_id === form.cancha_id ? equipoLocal?.nombre_mostrado : equipoVisitante?.nombre_mostrado}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 800, cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <GradientButton
                            type="submit"
                            variant={esNeutral ? 'warning' : 'primary'}
                            disabled={formLoading || (esNeutral && !neutralConfirmado)}
                            isLoading={formLoading}
                        >
                            {esNeutral ? '⚠️ Programar en Neutral' : 'Programar Partido'}
                        </GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal para aperturar jornada global */}
            <Modal isOpen={isAperturaModalOpen} onClose={() => setIsAperturaModalOpen(false)} title="Aperturar Jornada Global">
                <form onSubmit={handleAperturaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase' }}>Nombre de la Jornada (Opcional)</label>
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="Ej. Jornada 1 - Clausura"
                            value={aperturaForm.nombre}
                            onChange={e => setAperturaForm({ ...aperturaForm, nombre: e.target.value })}
                        />
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>* Si se deja vacío, el sistema asignará un nombre automático correlativo.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase' }}>Fecha del Día de Juego (Ej. Domingo)</label>
                            <input
                                type="date"
                                style={inputStyle}
                                value={aperturaForm.fecha_juego}
                                onChange={e => setAperturaForm({ ...aperturaForm, fecha_juego: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-bg-muted)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                        <p style={{ fontSize: '12px', color: 'var(--color-slate)', fontWeight: 600, margin: 0 }}>
                            El sistema generará automáticamente el rango semanal (Lunes a Domingo) y el nombre de la jornada basándose en esta fecha.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={() => setIsAperturaModalOpen(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 800, cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <GradientButton type="submit" variant="primary" disabled={generating} isLoading={generating}>
                            Aperturar Jornada
                        </GradientButton>
                    </div>
                </form>
            </Modal>
            {/* PDF Export Component - Off-screen for react-to-print */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '215.9mm' }}>
                <JornadaGlobalPDFExport
                    ref={pdfRef}
                    jornadaGlobal={selectedJG}
                    partidos={partidos}
                />
            </div>
        </div>
    );
}
