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
    }

    return (
        <Card title="Calendario y Jornadas">
            <div className="flex justify-end mb-6">
                <GradientButton 
                    onClick={() => {
                        // Sugerir el siguiente número
                        const nextNum = jornadas.length > 0 ? Math.max(...jornadas.map(j => j.numero)) + 1 : 1;
                        setJornadaForm(prev => ({ ...prev, numero: nextNum }));
                        setIsJornadaModalOpen(true);
                    }} 
                    icon={Plus}
                >
                    Nueva Jornada
                </GradientButton>
            </div>

            {loading ? (
                <div className="text-center py-8 text-slate-400 italic">Cargando jornadas...</div>
            ) : jornadas.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No hay jornadas creadas.</div>
            ) : (
                <div className="space-y-4">
                    {jornadas.map(jornada => (
                        <div key={jornada.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-soft transition-all">
                            {/* Accordion Header */}
                            <div 
                                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                                    expandedJornada === jornada.id ? 'bg-mx-green/5' : 'bg-slate-50 hover:bg-slate-100'
                                }`}
                                onClick={() => toggleExpand(jornada.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl text-white shadow-inner flex items-center justify-center font-black ${
                                        jornada.cerrada ? 'bg-slate-400' : 'bg-mx-green'
                                    }`}>
                                        J{jornada.numero}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-800">
                                            Jornada {jornada.numero}
                                            {jornada.cerrada && <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Cerrada</span>}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium">
                                            {jornada.fecha_inicio} al {jornada.fecha_fin}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {!jornada.cerrada && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCloseJornada(jornada.id); }}
                                            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-300 transition-colors"
                                        >
                                            Cerrar Jornada
                                        </button>
                                    )}
                                    <div className="text-slate-400">
                                        {expandedJornada === jornada.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Content (Matches) */}
                            {expandedJornada === jornada.id && (
                                <div className="p-5 bg-white border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Partidos Programados</h4>
                                        {!jornada.cerrada && (
                                            <button 
                                                onClick={() => openPartidoModal(jornada.id)}
                                                className="text-mx-green hover:text-green-700 text-xs font-bold flex items-center gap-1 bg-mx-green/10 px-3 py-1.5 rounded-lg transition-colors border border-mx-green/20"
                                            >
                                                <Plus size={14} /> Sugerir / Agregar Partido
                                            </button>
                                        )}
                                    </div>

                                    {/* Módulo de Partidos */}
                                    <div className="bg-slate-50 rounded-xl border border-slate-200">
                                        {!jornada.partidos || jornada.partidos.length === 0 ? (
                                            <div className="p-6 text-center text-slate-400 italic font-medium">
                                                Aún no se han programado partidos en esta jornada.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {jornada.partidos.map(partido => (
                                                    <div key={partido.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                                        {/* Team Left */}
                                                        <div className="flex-1 text-right">
                                                            <div className="font-black text-slate-800 text-lg">{partido.equipo_local?.nombre_mostrado}</div>
                                                        </div>
                                                        
                                                        {/* Center Score / Time */}
                                                        <div className="flex flex-col items-center justify-center px-4 w-32 border-x border-slate-200">
                                                            {partido.estado?.nombre === 'finalizado' || partido.cerrado ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-2xl font-black bg-slate-800 text-white px-3 py-1 rounded-lg">
                                                                        {partido.goles_local}
                                                                    </div>
                                                                    <span className="text-slate-400 font-bold">-</span>
                                                                    <div className="text-2xl font-black bg-slate-800 text-white px-3 py-1 rounded-lg">
                                                                        {partido.goles_visitante}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">vs</div>
                                                                    <div className="text-xs font-bold text-slate-600">
                                                                        {new Date(partido.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className={`mt-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${partido.cerrado ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                                                {partido.cerrado ? 'Cerrado' : (partido.estado?.nombre || 'Programado')}
                                                            </div>
                                                        </div>

                                                        {/* Team Right */}
                                                        <div className="flex-1 text-left">
                                                            <div className="font-black text-slate-800 text-lg">{partido.equipo_visitante?.nombre_mostrado}</div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2">
                                                            {!partido.cerrado && !jornada.cerrada && (
                                                                <>
                                                                    <button 
                                                                        onClick={() => openResultadoModal(partido)}
                                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors border border-blue-200"
                                                                    >
                                                                        Resultado
                                                                    </button>
                                                                    {partido.estado?.nombre === 'finalizado' && (
                                                                        <button 
                                                                            onClick={() => handleClosePartido(partido.id)}
                                                                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-lg transition-colors border border-red-200"
                                                                        >
                                                                            Cerrar
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear Jornada */}
            <Modal isOpen={isJornadaModalOpen} onClose={() => setIsJornadaModalOpen(false)} title="Crear Jornada">
                <form onSubmit={handleJornadaSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Número de Jornada</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                            value={jornadaForm.numero}
                            onChange={(e) => setJornadaForm({...jornadaForm, numero: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Inicio</label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                                value={jornadaForm.fecha_inicio}
                                onChange={(e) => setJornadaForm({...jornadaForm, fecha_inicio: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Fin</label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                                value={jornadaForm.fecha_fin}
                                onChange={(e) => setJornadaForm({...jornadaForm, fecha_fin: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsJornadaModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Cancelar</button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving}>Crear Jornada</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Crear Partido */}
            <Modal isOpen={isPartidoModalOpen} onClose={() => setIsPartidoModalOpen(false)} title="Programar Partido">
                <form onSubmit={handlePartidoSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Equipo Local</label>
                        <select 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                            value={partidoForm.equipo_local_id}
                            onChange={(e) => setPartidoForm({...partidoForm, equipo_local_id: e.target.value})}
                            required
                        >
                            <option value="">Seleccione equipo...</option>
                            {equiposInscritos.map(eq => (
                                <option key={eq.id} value={eq.id} disabled={eq.id === partidoForm.equipo_visitante_id}>{eq.nombre_mostrado}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-center my-2 text-slate-400 font-black">VS</div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Equipo Visitante</label>
                        <select 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                            value={partidoForm.equipo_visitante_id}
                            onChange={(e) => setPartidoForm({...partidoForm, equipo_visitante_id: e.target.value})}
                            required
                        >
                            <option value="">Seleccione equipo...</option>
                            {equiposInscritos.map(eq => (
                                <option key={eq.id} value={eq.id} disabled={eq.id === partidoForm.equipo_local_id}>{eq.nombre_mostrado}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Fecha y Hora</label>
                        <input 
                            type="datetime-local" 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                            value={partidoForm.fecha}
                            onChange={(e) => setPartidoForm({...partidoForm, fecha: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsPartidoModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Cancelar</button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving}>Guardar Partido</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Registrar Resultado */}
            <Modal isOpen={isResultadoModalOpen} onClose={() => setIsResultadoModalOpen(false)} title="Registrar Resultado">
                {selectedPartido && (
                    <form onSubmit={handleResultadoSubmit} className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center mb-6">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-2">Partido</div>
                            <div className="flex items-center justify-between px-4">
                                <span className="font-black text-slate-800 flex-1 text-right truncate pl-2">{selectedPartido.equipo_local?.nombre_mostrado}</span>
                                <span className="text-slate-400 font-black px-4 text-xs tracking-widest uppercase">vs</span>
                                <span className="font-black text-slate-800 flex-1 text-left truncate pr-2">{selectedPartido.equipo_visitante?.nombre_mostrado}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 items-center justify-center">
                            <div className="text-center flex flex-col items-center">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Goles Local</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="w-24 text-center text-4xl font-black px-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 focus:ring-4 focus:ring-mx-green/20 focus:border-mx-green transition-all"
                                    value={resultadoForm.goles_local}
                                    onChange={(e) => setResultadoForm({...resultadoForm, goles_local: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="text-center flex flex-col items-center">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Goles Visitante</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="w-24 text-center text-4xl font-black px-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 focus:ring-4 focus:ring-mx-green/20 focus:border-mx-green transition-all"
                                    value={resultadoForm.goles_visitante}
                                    onChange={(e) => setResultadoForm({...resultadoForm, goles_visitante: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-10">
                            <button type="button" onClick={() => setIsResultadoModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50">Cancelar</button>
                            <GradientButton type="submit" disabled={saving} isLoading={saving}>Guardar Resultado</GradientButton>
                        </div>
                    </form>
                )}
            </Modal>
        </Card>
    );
}
