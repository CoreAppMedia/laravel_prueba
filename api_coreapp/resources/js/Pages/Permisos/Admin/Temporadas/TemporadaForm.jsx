import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function TemporadaForm({ temporada, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: temporada?.nombre || '',
        fecha_inicio: temporada?.fecha_inicio || '',
        fecha_fin: temporada?.fecha_fin || '',
        activa: temporada?.activa ?? true
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (temporada) {
                await http.put(`/api/temporadas/${temporada.id}`, formData);
                toast.success('Temporada actualizada correctamente');
            } else {
                await http.post('/api/temporadas', formData);
                toast.success('Temporada creada correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar la temporada');
            }
        } finally {
            setLoading(false);
        }
    };

    // Estilos basados en el Design System de app.css
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

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Nombre de la Temporada */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Nombre de la Temporada</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.nombre ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    placeholder="Ej. Apertura 2026"
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

            {/* Fila: Período */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Fecha de Inicio</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.fecha_inicio ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.fecha_inicio ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.fecha_inicio && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.fecha_inicio[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Fecha de Finalización</label>
                    <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.fecha_fin ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.fecha_fin ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.fecha_fin && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.fecha_fin[0]}</p>}
                </div>
            </div>

            {/* Estatus */}
            <div 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '16px', 
                    background: 'var(--color-bg-surface-alt)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    marginTop: '8px'
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
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-terra)', cursor: 'pointer' }}
                />
                <label htmlFor="activa" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    Esta es la temporada activa actualmente
                </label>
            </div>
            {errors.activa && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.activa[0]}</p>}

            {/* Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost"
                    style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading} variant="primary">
                    {loading ? 'Procesando...' : (temporada ? 'Guardar Cambios' : 'Crear Temporada')}
                </GradientButton>
            </div>
        </form>
    );
}
