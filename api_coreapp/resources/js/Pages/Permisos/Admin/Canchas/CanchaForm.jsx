import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import { 
    Plus, Trash2, Clock, Calendar, MapPin, 
    Image as ImageIcon, Building2, CheckCircle2, 
    AlertCircle, Play, Pause 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CanchaForm({ cancha, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: cancha?.nombre || '',
        direccion: cancha?.direccion || '',
        imagen_url: cancha?.imagen_url || '',
        activa: cancha?.activa ?? true
    });

    const [horarios, setHorarios] = useState(cancha?.horarios || []);
    const [nuevoHorario, setNuevoHorario] = useState({ dia_semana: '1', hora: '10:00' });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddHorarioVirtual = () => {
        if (!nuevoHorario.dia_semana || !nuevoHorario.hora) return;
        setHorarios([...horarios, { ...nuevoHorario, activo: true, es_nuevo: true, temporal_id: Math.random().toString() }]);
        setNuevoHorario({ dia_semana: '1', hora: '10:00' });
    };

    const handleRemoveHorarioVirtual = async (horario) => {
        if (horario.id && !horario.es_nuevo) {
            if (!window.confirm('¿Seguro que deseas eliminar el horario de la base de datos?')) return;
            try {
                await http.delete(`/api/canchas/horarios/${horario.id}`);
                setHorarios(horarios.filter(h => h.id !== horario.id));
                toast.success('Horario eliminado');
            } catch (error) {
                toast.error('Error al eliminar el horario');
            }
        } else {
            setHorarios(horarios.filter(h => h.temporal_id !== horario.temporal_id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            let canchaId = cancha?.id;

            if (cancha) {
                await http.put(`/api/canchas/${cancha.id}`, formData);
                toast.success('Información de la Sede Oficial actualizada');
            } else {
                const response = await http.post('/api/canchas', formData);
                canchaId = response.data.id;
                toast.success('Sede registrada correctamente');
            }

            // Procesar guardado de nuevos horarios
            const horariosNuevos = horarios.filter(h => h.es_nuevo);
            if (horariosNuevos.length > 0) {
                for (const hn of horariosNuevos) {
                    await http.post(`/api/canchas/${canchaId}/horarios`, {
                        dia_semana: hn.dia_semana,
                        hora: hn.hora,
                        activo: true
                    });
                }
                toast.success('Horarios registrados');
            }

            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar la sede');
            }
        } finally {
            setLoading(false);
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

    const labelClass = "text-label";

    const diaMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* ── SECCIÓN: IDENTIDAD DE LA SEDE ── */}
            <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                    <Building2 size={14} /> Información de la Sede
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        Nombre del Complejo / Cancha
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.nombre ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="Ej. Estadio Municipal / Cancha Central Reforma"
                        required
                    />
                    {errors.nombre && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.nombre[0]}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        <MapPin size={12} /> Ubicación o Referencia
                    </label>
                    <textarea
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        rows="1"
                        style={{
                            ...inputStyle,
                            ...(errors.direccion ? { border: '1px solid var(--color-danger)' } : {}),
                            resize: 'vertical',
                            minHeight: '44px'
                        }}
                        placeholder="Av. Principal #123, Col. Centro..."
                    />
                    {errors.direccion && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.direccion[0]}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                       <ImageIcon size={12} /> Fotografía (URL)
                    </label>
                    <input
                        type="url"
                        name="imagen_url"
                        value={formData.imagen_url}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.imagen_url ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="https://ejemplo.com/cancha.jpg"
                    />
                </div>
            </div>

            {/* ── SECCIÓN: GESTIÓN DE HORARIOS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Calendar size={14} /> Disponibilidad Habitual
                    </div>
                </div>

                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', padding: '16px', backgroundColor: 'var(--color-bg-surface-alt)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Día de la Semana</label>
                            <select 
                                value={nuevoHorario.dia_semana}
                                onChange={(e) => setNuevoHorario({...nuevoHorario, dia_semana: e.target.value})}
                                style={{ ...inputStyle, padding: '10px' }}
                            >
                                <option value="1">Lunes</option>
                                <option value="2">Martes</option>
                                <option value="3">Miércoles</option>
                                <option value="4">Jueves</option>
                                <option value="5">Viernes</option>
                                <option value="6">Sábado</option>
                                <option value="7">Domingo</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hora de Inicio</label>
                            <input 
                                type="time"
                                value={nuevoHorario.hora}
                                onChange={(e) => setNuevoHorario({...nuevoHorario, hora: e.target.value})}
                                style={{ ...inputStyle, padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button 
                                type="button" 
                                onClick={handleAddHorarioVirtual}
                                style={{ 
                                    padding: '0 20px', 
                                    backgroundColor: 'var(--color-gold)', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: 'var(--radius-md)', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    height: '42px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
                            >
                                <Plus size={14} strokeWidth={3} /> Agregar
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
                        {horarios.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <Clock size={32} style={{ color: 'var(--color-border-subtle)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>No hay horarios configurados para esta sede.</span>
                            </div>
                        ) : (
                            horarios.map((h, i) => (
                                <div key={h.id || h.temporal_id || i} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '12px 20px', 
                                    borderBottom: i === horarios.length - 1 ? 'none' : '1px solid var(--color-bg-surface-alt)',
                                    transition: 'background 0.2s'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                                            <Clock size={16} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-slate)' }}>{diaMap[h.dia_semana]}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{typeof h.hora === 'string' ? h.hora.substring(0, 5) : h.hora} hrs</span>
                                        </div>
                                        {h.es_nuevo && (
                                            <span style={{ fontSize: '9px', fontWeight: 900, backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nueva</span>
                                        )}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveHorarioVirtual(h)}
                                        style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--color-terra)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-terra-light)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── ESTATUS DE OPERACIÓN ── */}
            <div 
                onClick={() => handleChange({ target: { name: 'activa', type: 'checkbox', checked: !formData.activa } })}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px 20px', 
                    background: formData.activa ? 'var(--color-bg-surface-alt)' : 'white', 
                    borderRadius: 'var(--radius-lg)', 
                    border: `1px solid ${formData.activa ? 'var(--color-gold)' : 'var(--color-border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '8px'
                }}
            >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={18} style={{ color: formData.activa ? 'var(--color-gold)' : 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sede en Funcionamiento</span>
                </div>
                <div style={{ 
                    width: '40px', 
                    height: '22px', 
                    backgroundColor: formData.activa ? 'var(--color-gold)' : 'var(--color-border-subtle)', 
                    borderRadius: '20px',
                    position: 'relative',
                    transition: 'all 0.3s'
                }}>
                    <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        backgroundColor: 'white', 
                        borderRadius: '50%', 
                        position: 'absolute', 
                        top: '3px', 
                        left: formData.activa ? '21px' : '3px',
                        transition: 'all 0.3s'
                    }} />
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading} variant="primary" style={{ padding: '12px 32px' }}>
                    {loading ? 'Guardando...' : (cancha ? 'Actualizar Sede' : 'Registrar Nueva Sede')}
                </GradientButton>
            </div>
        </form>
    );
}
