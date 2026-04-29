import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { Calendar, Plus, CalendarDays, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RolDeJuegoContent() {
    const [selectedDate, setSelectedDate] = useState(() => {
        // Default to the next Sunday
        const d = new Date();
        d.setDate(d.getDate() + (7 - d.getDay()) % 7);
        // if today is Sunday, it will stay today. If we want next Sunday explicitly:
        if (d.getDay() === 0 && d.toDateString() !== new Date().toDateString()) {
            // Already Sunday
        }
        return d.toISOString().split('T')[0];
    });

    const [canchas, setCanchas] = useState([]);
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    
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

    const diaSemanaMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

    useEffect(() => {
        fetchData();
        fetchTorneos();

        // Polling silencioso cada 15 segundos para auto-sincronización
        const interval = setInterval(() => {
            fetchData(true);
        }, 15000);

        return () => clearInterval(interval);
    }, [selectedDate]);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [resCanchas, resPartidos] = await Promise.all([
                http.get('/api/rol-de-juego/canchas-activas'),
                http.get(`/api/rol-de-juego/partidos?fecha=${selectedDate}`)
            ]);
            setCanchas(resCanchas.data);
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
                
                // Filtrar solo jornadas abiertas o disponibles
                setJornadas(resJornadas.data.filter(j => !j.cerrada));
                setEquipos(resEquipos.data);
                
                setForm(prev => ({ ...prev, jornada_id: '', equipo_local_id: '', equipo_visitante_id: '' }));
            } catch (error) {
                toast.error('Error al cargar detalles del torneo.');
            }
        };

        fetchTorneoDetails();
    }, [selectedTorneoId]);

    const handleGenerarJornadas = async () => {
        if (!confirm('¿Estás seguro de aperturar automáticamente la siguiente jornada para TODOS los torneos activos?')) return;
        
        setGenerating(true);
        try {
            const res = await http.post('/api/rol-de-juego/generar-jornadas');
            toast.success(res.data.message);
            // Refresh torneos data to get new jornadas
            if (selectedTorneoId) {
                // To force re-fetch of selected torneo jornadas
                const prev = selectedTorneoId;
                setSelectedTorneoId('');
                setTimeout(() => setSelectedTorneoId(prev), 100);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al generar jornadas.');
        } finally {
            setGenerating(false);
        }
    };

    const getDayOfWeek = (dateString) => {
        // Date.getDay() returns 0 for Sunday, 1 for Monday...
        // CanchaHorario uses 1 for Monday, 7 for Sunday.
        const date = new Date(`${dateString}T12:00:00Z`); // Avoid timezone shift
        const day = date.getDay();
        return day === 0 ? 7 : day;
    };

    const formatHora = (t) => (typeof t === 'string' ? t.substring(0, 5) : '');

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

    const selectedDayOfWeek = getDayOfWeek(selectedDate);

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
            {/* Header / Date Selector */}
            <Card style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--color-slate)' }}>Rol de Juego Global</h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        Visualiza y programa partidos de todos los torneos sin empalmar horarios.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <GradientButton 
                        onClick={handleGenerarJornadas} 
                        variant="primary" 
                        isLoading={generating}
                        disabled={generating}
                    >
                        <Plus size={16} style={{ marginRight: '6px' }} />
                        Aperturar Jornada Global
                    </GradientButton>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-muted)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                        <CalendarDays size={18} color="var(--color-gold)" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-text-primary)' }}
                        />
                    </div>
                    <GradientButton onClick={fetchData} variant="secondary">Actualizar</GradientButton>
                </div>
            </Card>

            {/* Grid de Canchas (Estilo PDF) */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Cargando programación...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {canchas.map(cancha => {
                        // Filtrar horarios que correspondan al día de la semana seleccionado
                        const horariosDia = (cancha.horarios || []).filter(h => h.dia_semana === selectedDayOfWeek).sort((a, b) => a.hora.localeCompare(b.hora));
                        
                        if (horariosDia.length === 0) return null; // No mostrar canchas sin horario este día

                        return (
                            <div key={cancha.id} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-bg-surface)' }}>
                                <div style={{ backgroundColor: 'var(--color-slate)', color: 'white', padding: '12px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '14px', fontFamily: 'var(--font-display)' }}>
                                    {cancha.nombre}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {horariosDia.map(horario => {
                                        // Buscar si hay partido en este horario y cancha
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
                                                                <div style={{ flex: 1, textAlign: 'right', fontWeight: 800, color: 'var(--color-text-primary)' }}>{partido.equipoLocal?.nombre_mostrado}</div>
                                                                <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)' }}>VS</div>
                                                                <div style={{ flex: 1, textAlign: 'left', fontWeight: 800, color: 'var(--color-text-primary)' }}>{partido.equipoVisitante?.nombre_mostrado}</div>
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
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}><Shield size={12}/> Local</label>
                            <select style={inputStyle} value={form.equipo_local_id} onChange={e => setForm({ ...form, equipo_local_id: e.target.value })} required disabled={!selectedTorneoId}>
                                <option value="">Seleccionar...</option>
                                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre_mostrado}</option>)}
                            </select>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-gold)', marginTop: '20px' }}>VS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}><Shield size={12}/> Visitante</label>
                            <select style={inputStyle} value={form.equipo_visitante_id} onChange={e => setForm({ ...form, equipo_visitante_id: e.target.value })} required disabled={!selectedTorneoId}>
                                <option value="">Seleccionar...</option>
                                {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre_mostrado}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 800, cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <GradientButton type="submit" variant="primary" disabled={formLoading} isLoading={formLoading}>
                            Programar Partido
                        </GradientButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
