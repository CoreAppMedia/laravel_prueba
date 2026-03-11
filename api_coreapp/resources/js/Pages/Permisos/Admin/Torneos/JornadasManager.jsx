import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { Plus, Check, X, Calendar, ChevronDown, ChevronRight, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JornadasManager({ torneo }) {
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedJornada, setExpandedJornada] = useState(null);

    // Modal states
    const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
    const [isPartidoModalOpen, setIsPartidoModalOpen] = useState(false);
    const [isResultadoModalOpen, setIsResultadoModalOpen] = useState(false);

    // Form states - Jornada
    const [jornadaForm, setJornadaForm] = useState({ numero: '', fecha_inicio: '', fecha_fin: '' });
    
    // Form states - Partido
    const [partidoForm, setPartidoForm] = useState({ equipo_local_id: '', equipo_visitante_id: '', fecha: '' });
    const [selectedJornadaId, setSelectedJornadaId] = useState(null);
    const [equiposInscritos, setEquiposInscritos] = useState([]);

    // Form states - Resultado
    const [resultadoForm, setResultadoForm] = useState({ goles_local: 0, goles_visitante: 0 });
    const [selectedPartido, setSelectedPartido] = useState(null);

    const [saving, setSaving] = useState(false);

    const fetchJornadas = async () => {
        setLoading(true);
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/jornadas`);
            // To get matches within each matchday easily, we might need a modified endpoint or we fetch all matches per jornada.
            // For now, we assume the API includes `partidos` relationship, or we fetch it. 
            // Wait, looking at Jornada model, it has `partidos` relation. We should ensure the controller loads them.
            // If the current backend doesn't load them eagerly `indexByTorneo`, we will just display what's available or fetch per jornada.
            setJornadas(response.data);
            
            // Auto expand first not closed
            const firstOpen = response.data.find(j => !j.cerrada);
            if (firstOpen && !expandedJornada) setExpandedJornada(firstOpen.id);
        } catch (error) {
            toast.error('Error al cargar jornadas');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquiposInscritos = async () => {
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/equipos-inscritos`);
            setEquiposInscritos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchJornadas();
        fetchEquiposInscritos();
    }, [torneo.id]);

    const handleJornadaSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/torneos/${torneo.id}/jornadas`, jornadaForm);
            toast.success('Jornada creada con éxito');
            setIsJornadaModalOpen(false);
            setJornadaForm({ numero: '', fecha_inicio: '', fecha_fin: '' });
            fetchJornadas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la jornada');
        } finally {
            setSaving(false);
        }
    };

    const handleCloseJornada = async (jornadaId) => {
        if (!window.confirm('¿Seguro que deseas CERRAR esta jornada? Esto es irreversible y requiere que todos los partidos estén cerrados.')) return;
        try {
            await http.patch(`/api/jornadas/${jornadaId}/cerrar`);
            toast.success('Jornada cerrada correctamente');
            fetchJornadas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cerrar jornada');
        }
    };

    const toggleExpand = (id) => {
        setExpandedJornada(expandedJornada === id ? null : id);
    };

    const openPartidoModal = (jornadaId) => {
        setSelectedJornadaId(jornadaId);
        setPartidoForm({ equipo_local_id: '', equipo_visitante_id: '', fecha: '' });
        setIsPartidoModalOpen(true);
    };

    const handlePartidoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/jornadas/${selectedJornadaId}/partidos`, partidoForm);
            toast.success('Partido programado con éxito');
            setIsPartidoModalOpen(false);
            fetchJornadas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al programar el partido');
        } finally {
            setSaving(false);
        }
    };

    const openResultadoModal = (partido) => {
        setSelectedPartido(partido);
        setResultadoForm({ 
            goles_local: partido.goles_local ?? 0, 
            goles_visitante: partido.goles_visitante ?? 0 
        });
        setIsResultadoModalOpen(true);
    };

    const handleResultadoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/partidos/${selectedPartido.id}/resultado`, resultadoForm);
            toast.success('Resultado guardado');
            setIsResultadoModalOpen(false);
            fetchJornadas();
        } catch (error) {
            toast.error('Error al guardar resultado');
        } finally {
            setSaving(false);
        }
    };

    const handleClosePartido = async (partidoId) => {
        if (!window.confirm('¿Deseas cerrar el partido? Ya no podrás editar el resultado.')) return;
        try {
            await http.patch(`/api/partidos/${partidoId}/cerrar`);
            toast.success('Partido cerrado definitivamente');
            fetchJornadas();
        } catch (error) {
            toast.error('Error al cerrar partido');
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
        transition: 'all 0.2s ease',
        outline: 'none',
        boxShadow: 'var(--shadow-soft)',
    };

    return (
        <Card title="Calendario y Organización de Jornadas">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <GradientButton 
                    onClick={() => {
                        const nextNum = jornadas.length > 0 ? Math.max(...jornadas.map(j => j.numero)) + 1 : 1;
                        setJornadaForm(prev => ({ ...prev, numero: nextNum }));
                        setIsJornadaModalOpen(true);
                    }} 
                    icon={Plus}
                    variant="primary"
                >
                    Aperturar Nueva Jornada
                </GradientButton>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>Cargando jornadas oficiales...</div>
            ) : jornadas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    No se han generado jornadas para este torneo todavía.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {jornadas.map(jornada => (
                        <div key={jornada.id} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s ease' }}>
                            {/* Accordion Header Premium */}
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    padding: '16px 24px', 
                                    cursor: 'pointer', 
                                    backgroundColor: expandedJornada === jornada.id ? 'var(--color-bg-surface-alt)' : 'var(--color-bg-surface)',
                                    transition: 'background-color 0.3s'
                                }}
                                onClick={() => toggleExpand(jornada.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ 
                                        width: '42px', 
                                        height: '42px', 
                                        borderRadius: 'var(--radius-sm)', 
                                        backgroundColor: jornada.cerrada ? 'var(--color-text-muted)' : 'var(--color-gold)', 
                                        color: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontWeight: 900,
                                        fontSize: '16px',
                                        fontFamily: 'var(--font-display)',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {jornada.numero}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-slate)', fontFamily: 'var(--font-display)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Jornada {jornada.numero} de Competencia
                                            {jornada.cerrada && <span style={{ fontSize: '9px', backgroundColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Finalizada</span>}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <Calendar size={12} style={{ color: 'var(--color-gold)' }} />
                                            Periodo: {jornada.fecha_inicio} al {jornada.fecha_fin}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    {!jornada.cerrada && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCloseJornada(jornada.id); }}
                                            className="btn-ghost"
                                            style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-terra)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(192, 68, 42, 0.15)', background: 'var(--color-terra-light)' }}
                                        >
                                            Cerrar Fase
                                        </button>
                                    )}
                                    <div style={{ color: 'var(--color-text-muted)' }}>
                                        {expandedJornada === jornada.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Content (Matches) */}
                            {expandedJornada === jornada.id && (
                                <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-body)' }}>Rol de Partidos Oficiales</h4>
                                        {!jornada.cerrada && (
                                            <button 
                                                onClick={() => openPartidoModal(jornada.id)}
                                                className="btn-ghost"
                                                style={{ fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-sage)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-sage-light)', border: '1px solid rgba(58, 107, 82, 0.1)' }}
                                            >
                                                <Plus size={14} /> Programar Encuentro
                                            </button>
                                        )}
                                    </div>

                                    {/* Módulo de Partidos Scoreboard Look */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {!jornada.partidos || jornada.partidos.length === 0 ? (
                                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', fontStyle: 'italic', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                                                Sin programación de partidos para esta cartelera.
                                            </div>
                                        ) : (
                                            jornada.partidos.map(partido => (
                                                <div key={partido.id} style={{ 
                                                    padding: '20px', 
                                                    backgroundColor: 'var(--color-bg-surface-alt)', 
                                                    borderRadius: 'var(--radius-sm)', 
                                                    border: '1px solid var(--color-border-subtle)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '24px'
                                                }}>
                                                    {/* Team Left */}
                                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 700, color: 'var(--color-slate)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>{partido.equipo_local?.nombre_mostrado}</div>
                                                    </div>
                                                    
                                                    {/* Center Score / Time */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '140px' }}>
                                                        {partido.estado?.nombre === 'finalizado' || partido.cerrado ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: 900, backgroundColor: 'var(--color-slate)', color: 'white', padding: '4px 14px', borderRadius: '6px', minWidth: '50px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                                                    {partido.goles_local}
                                                                </div>
                                                                <span style={{ color: 'var(--color-gold)', fontWeight: 900, fontSize: '20px' }}>:</span>
                                                                <div style={{ fontSize: '24px', fontWeight: 900, backgroundColor: 'var(--color-slate)', color: 'white', padding: '4px 14px', borderRadius: '6px', minWidth: '50px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                                                    {partido.goles_visitante}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>VS</div>
                                                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                                                                    {new Date(partido.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} HRS
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div style={{ marginTop: '10px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '2px 10px', borderRadius: '20px', backgroundColor: partido.cerrado ? 'var(--color-terra-light)' : 'var(--color-border-subtle)', color: partido.cerrado ? 'var(--color-terra)' : 'var(--color-text-muted)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                            {partido.cerrado ? 'ACTA CERRADA' : (partido.estado?.nombre || 'PROGRAMADO')}
                                                        </div>
                                                    </div>

                                                    {/* Team Right */}
                                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                                        <div style={{ fontWeight: 700, color: 'var(--color-slate)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>{partido.equipo_visitante?.nombre_mostrado}</div>
                                                    </div>

                                                    {/* Actions Quick */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px', justifyContent: 'flex-end' }}>
                                                        {!partido.cerrado && !jornada.cerrada && (
                                                            <>
                                                                <button 
                                                                    onClick={() => openResultadoModal(partido)}
                                                                    className="btn-ghost"
                                                                    style={{ padding: '6px 10px', color: 'var(--color-sage)', border: '1px solid rgba(58, 107, 82, 0.1)', background: 'var(--color-sage-light)', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}
                                                                    title="Capturar Marcador"
                                                                >
                                                                    <Trophy size={14} />
                                                                </button>
                                                                {partido.estado?.nombre === 'finalizado' && (
                                                                    <button 
                                                                        onClick={() => handleClosePartido(partido.id)}
                                                                        className="btn-ghost"
                                                                        style={{ padding: '6px 10px', color: 'var(--color-terra)', border: '1px solid rgba(192, 68, 42, 0.1)', background: 'var(--color-terra-light)', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}
                                                                        title="Cerrar Partido"
                                                                    >
                                                                        <Check size={14} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear Jornada */}
            <Modal isOpen={isJornadaModalOpen} onClose={() => setIsJornadaModalOpen(false)} title="Aperturar Nueva Jornada">
                <form onSubmit={handleJornadaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Número de Jornada (Fase)</label>
                        <input 
                            type="number" 
                            min="1"
                            style={inputStyle}
                            value={jornadaForm.numero}
                            onChange={(e) => setJornadaForm({...jornadaForm, numero: e.target.value})}
                            required
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label" style={{ marginLeft: '4px' }}>Inicia</label>
                            <input 
                                type="date" 
                                style={inputStyle}
                                value={jornadaForm.fecha_inicio}
                                onChange={(e) => setJornadaForm({...jornadaForm, fecha_inicio: e.target.value})}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label" style={{ marginLeft: '4px' }}>Finaliza</label>
                            <input 
                                type="date" 
                                style={inputStyle}
                                value={jornadaForm.fecha_fin}
                                onChange={(e) => setJornadaForm({...jornadaForm, fecha_fin: e.target.value})}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => setIsJornadaModalOpen(false)} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Cancelar</button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Crear Jornada Oficial</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Crear Partido */}
            <Modal isOpen={isPartidoModalOpen} onClose={() => setIsPartidoModalOpen(false)} title="Programación de Encuentro">
                <form onSubmit={handlePartidoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Escuadra Local</label>
                        <select 
                            style={inputStyle}
                            value={partidoForm.equipo_local_id}
                            onChange={(e) => setPartidoForm({...partidoForm, equipo_local_id: e.target.value})}
                            required
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                        >
                            <option value="">-- Seleccione equipo --</option>
                            {equiposInscritos.map(eq => (
                                <option key={eq.id} value={eq.id} disabled={eq.id === partidoForm.equipo_visitante_id}>{eq.nombre_mostrado}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 900, color: 'var(--color-gold)', letterSpacing: '4px' }}>VS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Escuadra Visitante</label>
                        <select 
                            style={inputStyle}
                            value={partidoForm.equipo_visitante_id}
                            onChange={(e) => setPartidoForm({...partidoForm, equipo_visitante_id: e.target.value})}
                            required
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                        >
                            <option value="">-- Seleccione equipo --</option>
                            {equiposInscritos.map(eq => (
                                <option key={eq.id} value={eq.id} disabled={eq.id === partidoForm.equipo_local_id}>{eq.nombre_mostrado}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Fecha y Hora del Silbatazo</label>
                        <input 
                            type="datetime-local" 
                            style={inputStyle}
                            value={partidoForm.fecha}
                            onChange={(e) => setPartidoForm({...partidoForm, fecha: e.target.value})}
                            required
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => setIsPartidoModalOpen(false)} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Cancelar</button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Agendar Partido</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Registrar Resultado */}
            <Modal isOpen={isResultadoModalOpen} onClose={() => setIsResultadoModalOpen(false)} title="Acta de Resultados Oficiales">
                {selectedPartido && (
                    <form onSubmit={handleResultadoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Detalles del Encuentro</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-slate)', fontSize: '18px', flex: 1, textAlign: 'right' }}>{selectedPartido.equipo_local?.nombre_mostrado}</span>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 900, fontSize: '12px' }}>VS</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-slate)', fontSize: '18px', flex: 1, textAlign: 'left' }}>{selectedPartido.equipo_visitante?.nombre_mostrado}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1.5px' }}>Goles Local</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    style={{ ...inputStyle, textAlign: 'center', fontSize: '42px', fontWeight: 900, height: '90px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-display)' }}
                                    value={resultadoForm.goles_local}
                                    onChange={(e) => setResultadoForm({...resultadoForm, goles_local: e.target.value})}
                                    required
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                                />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <label style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1.5px' }}>Goles Visitante</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    style={{ ...inputStyle, textAlign: 'center', fontSize: '42px', fontWeight: 900, height: '90px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-display)' }}
                                    value={resultadoForm.goles_visitante}
                                    onChange={(e) => setResultadoForm({...resultadoForm, goles_visitante: e.target.value})}
                                    required
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)'; e.target.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.15)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'var(--shadow-soft)'; }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                            <button type="button" onClick={() => setIsResultadoModalOpen(false)} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Cancelar</button>
                            <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Validar Marcador</GradientButton>
                        </div>
                    </form>
                )}
            </Modal>
        </Card>
    );
}
