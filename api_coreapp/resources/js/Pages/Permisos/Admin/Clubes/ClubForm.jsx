import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function ClubForm({ club, onSuccess, onCancel }) {
    const [directivos, setDirectivos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nombre: club?.nombre || '',
        es_club: club?.es_club ?? true,
        telefono: club?.telefono || '',
        correo: club?.correo || '',
        directivo_id: club?.directivo_id || '',
        activo: club?.activo ?? true
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        const fetchDirectivos = async () => {
            try {
                const res = await http.get('/api/directivos/disponibles-para-club');
                let disponibles = res.data;
                
                // Si estamos editando y ya tiene dueño, hay que cargarlo separadamente y agregarlo a la lista de opciones
                if (club?.directivo_id) {
                    const currentRes = await http.get(`/api/directivos/${club.directivo_id}`);
                    const exists = disponibles.find(d => d.id === club.directivo_id);
                    if (!exists && currentRes.data) {
                        disponibles = [currentRes.data, ...disponibles];
                    }
                }
                setDirectivos(disponibles);
            } catch (error) {
                console.error("Error al cargar dueños", error);
            }
        };
        fetchDirectivos();
    }, [club]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (club) {
                await http.put(`/api/clubs/${club.id}`, formData);
                toast.success('Información del club actualizada');
            } else {
                await http.post('/api/clubs', formData);
                toast.success('Club registrado correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el club');
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

    const labelClass = "text-label"; // Clase definida en app.css para etiquetas consistente

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Nombre del Club */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Nombre del Club / Equipo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.nombre ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    placeholder="Ej. Real Sociedad"
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

            {/* Directivo / Dueño */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Dueño / Presidente del Club <span className="text-xs font-normal text-slate-400">(Opcional)</span></label>
                <select
                    name="directivo_id"
                    value={formData.directivo_id}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.directivo_id ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                >
                    <option value="">-- Sin dueño asignado --</option>
                    {directivos.map((d) => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                </select>
                {errors.directivo_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.directivo_id[0]}</p>}
            </div>

            {/* Fila: Teléfono y Correo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Teléfono de contacto</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.telefono ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="Ej. 5512345678"
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.telefono ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.telefono && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.telefono[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Correo Electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.correo ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="contacto@club.com"
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.correo ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.correo && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.correo[0]}</p>}
                </div>
            </div>

            {/* Opciones de Checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '16px', 
                        background: 'var(--color-bg-surface-alt)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => handleChange({ target: { name: 'es_club', type: 'checkbox', checked: !formData.es_club } })}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-alt)'}
                >
                    <input
                        type="checkbox"
                        id="es_club"
                        name="es_club"
                        checked={formData.es_club}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-terra)', cursor: 'pointer' }}
                    />
                    <label htmlFor="es_club" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        ¿Es un Club consolidado? <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Tiene múltiples equipos)</span>
                    </label>
                </div>

                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '16px', 
                        background: 'var(--color-bg-surface-alt)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => handleChange({ target: { name: 'activo', type: 'checkbox', checked: !formData.activo } })}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-alt)'}
                >
                    <input
                        type="checkbox"
                        id="activo"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-terra)', cursor: 'pointer' }}
                    />
                    <label htmlFor="activo" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        Registro Activo para competencias
                    </label>
                </div>
            </div>

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
                    {loading ? 'Procesando...' : (club ? 'Guardar Cambios' : 'Registrar Club')}
                </GradientButton>
            </div>
        </form>
    );
}
