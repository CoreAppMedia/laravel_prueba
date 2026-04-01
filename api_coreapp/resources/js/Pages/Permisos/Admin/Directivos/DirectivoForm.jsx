import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import toast from 'react-hot-toast';
import GradientButton from '../../../../Components/UI/GradientButton';
import { User, Phone, Mail, MapPin, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DirectivoForm({ directivo, onSuccess, onCancel }) {
    const [tiposDueno, setTiposDueno] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: directivo?.nombre || '',
        telefono: directivo?.telefono || '',
        direccion: directivo?.direccion || '',
        correo_electronico: directivo?.correo_electronico || '',
        catalogo_tipo_dueno_id: directivo?.catalogo_tipo_dueno_id || '',
        activo: directivo ? directivo.activo : true,
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadTipos = async () => {
            try {
                const res = await http.get('/api/catalogos/tipos-duenos');
                setTiposDueno(res.data);
                if (!directivo && res.data.length > 0) {
                    setFormData(prev => ({ ...prev, catalogo_tipo_dueno_id: res.data[0].id }));
                }
            } catch(e) {
                console.error("Error cargando tipos", e);
            }
        };
        loadTipos();
    }, [directivo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (directivo) {
                await http.put(`/api/directivos/${directivo.id}`, formData);
                toast.success('Directivo actualizado correctamente');
            } else {
                await http.post('/api/directivos', formData);
                toast.success('Directivo registrado correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el directivo');
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

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: 800,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '8px',
        marginLeft: '4px'
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Sección: Información Principal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>
                        <User size={14} style={{ color: 'var(--color-gold)' }} /> Nombre Completo <span style={{ color: 'var(--color-terra)' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.nombre ? 'var(--color-terra)' : 'var(--color-border-subtle)' }}
                        placeholder="Ej. Juan Pérez"
                        required
                    />
                    {errors.nombre && <p style={{ fontSize: '11px', color: 'var(--color-terra)', marginTop: '4px', fontWeight: 700 }}>{errors.nombre[0]}</p>}
                </div>

                <div>
                    <label style={labelStyle}>
                        <Briefcase size={14} style={{ color: 'var(--color-gold)' }} /> Rol / Tipo <span style={{ color: 'var(--color-terra)' }}>*</span>
                    </label>
                    <select
                        value={formData.catalogo_tipo_dueno_id}
                        onChange={e => setFormData({ ...formData, catalogo_tipo_dueno_id: e.target.value })}
                        style={inputStyle}
                        required
                    >
                        <option value="">Selecciona rol...</option>
                        {tiposDueno.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>
                        <Phone size={14} style={{ color: 'var(--color-gold)' }} /> Teléfono
                    </label>
                    <input
                        type="text"
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        style={inputStyle}
                        placeholder="Ej. 555-123-4567"
                    />
                </div>
            </div>

            {/* Sección: Contacto Adicional */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>
                        <Mail size={14} style={{ color: 'var(--color-gold)' }} /> Correo Electrónico
                    </label>
                    <input
                        type="email"
                        value={formData.correo_electronico}
                        onChange={e => setFormData({ ...formData, correo_electronico: e.target.value })}
                        style={inputStyle}
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div>
                    <label style={labelStyle}>
                        <MapPin size={14} style={{ color: 'var(--color-gold)' }} /> Dirección
                    </label>
                    <input
                        type="text"
                        value={formData.direccion}
                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                        style={inputStyle}
                        placeholder="Dirección completa..."
                    />
                </div>
            </div>

            {/* Selector de Estado */}
            <div 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '16px', 
                    backgroundColor: 'var(--color-bg-surface-alt)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{ position: 'relative', width: '44px', height: '24px' }}>
                    <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                        id="activo-toggle"
                    />
                    <label
                        htmlFor="activo-toggle"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: formData.activo ? 'var(--color-sage)' : 'var(--color-slate-light)',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            transition: '0.4s'
                        }}
                    >
                        <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '18px', width: '18px',
                            left: formData.activo ? '22px' : '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: '0.4s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}></span>
                    </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: formData.activo ? 'var(--color-sage)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {formData.activo ? 'Estatus: Vigente' : 'Estatus: Suspendido'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        {formData.activo ? 'El directivo puede gestionar clubes/equipos.' : 'El acceso y gestión están restringidos.'}
                    </span>
                </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <div style={{ flex: 1.5 }}>
                    <GradientButton 
                        type="submit" 
                        disabled={loading} 
                        isLoading={loading} 
                        variant="primary"
                        style={{ width: '100%' }}
                    >
                        {directivo ? 'Actualizar Información' : 'Registrar Directivo'}
                    </GradientButton>
                </div>
            </div>
        </form>
    );
}
