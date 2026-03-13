import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nombre */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Nombre Identificador (Cancha / Complejo)</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.nombre ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    placeholder="Ej. Estadio Municipal o Cancha 1 Reforma"
                    required
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.nombre ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                />
                {errors.nombre && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.nombre[0]}</p>}
            </div>

            {/* Dirección */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Ubicación Física o Referencia</label>
                <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    rows="1"
                    style={{
                        ...inputStyle,
                        ...(errors.direccion ? { border: '1px solid var(--color-danger)' } : {}),
                        resize: 'vertical',
                        minHeight: '40px'
                    }}
                    placeholder="Ej. Av. Siempre Viva 123"
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.direccion ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                />
                {errors.direccion && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.direccion[0]}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>URL de Fotografía de la Cancha (Opcional)</label>
                    <input
                        type="url"
                        name="imagen_url"
                        value={formData.imagen_url}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.imagen_url ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="https://..."
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.imagen_url ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.imagen_url && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.imagen_url[0]}</p>}
                </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

            {/* Gestión de Horarios List */}
            <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    Horarios Disponibles Habituales
                </h4>
                
                <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label className={labelClass} style={{ fontSize: '11px' }}>Día</label>
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
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label className={labelClass} style={{ fontSize: '11px' }}>Hora</label>
                            <input 
                                type="time"
                                value={nuevoHorario.hora}
                                onChange={(e) => setNuevoHorario({...nuevoHorario, hora: e.target.value})}
                                style={{ ...inputStyle, padding: '10px' }}
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddHorarioVirtual}
                            style={{ 
                                padding: '10px 16px', 
                                backgroundColor: 'var(--color-gold)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: 'var(--radius-md)', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 700,
                                boxShadow: '0 4px 6px rgba(212, 175, 55, 0.2)',
                                transition: 'all 0.2s',
                                height: '42px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={16} /> Agregar
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {horarios.length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '12px' }}>
                                Sin horarios definidos registrados para esta sede.
                            </div>
                        ) : (
                            horarios.map((h, i) => (
                                <div key={h.id || h.temporal_id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                        <Clock size={16} style={{ color: 'var(--color-gold)' }} />
                                        <span>{diaMap[h.dia_semana]} - {typeof h.hora === 'string' ? h.hora.substring(0, 5) : h.hora} hrs</span>
                                        {h.es_nuevo && <span style={{ fontSize: '10px', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Nuevo</span>}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveHorarioVirtual(h)}
                                        className="btn-ghost"
                                        style={{ color: 'var(--color-terra)', padding: '4px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: '4px 0' }} />

            {/* Opciones de Checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        background: 'var(--color-bg-surface-alt)',  
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => handleChange({ target: { name: 'activa', type: 'checkbox', checked: !formData.activa } })}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-alt)'}
                >
                    <input
                        type="checkbox"
                        id="activa"
                        name="activa"
                        checked={formData.activa}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-navy)', cursor: 'pointer' }}
                    />
                    <label htmlFor="activa" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        Cancha en funcionamiento y activa
                    </label>
                </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost"
                    style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading} variant="primary">
                    {loading ? 'Procesando...' : (cancha ? 'Guardar Configuración' : 'Registrar Sede')}
                </GradientButton>
            </div>
        </form>
    );
}
