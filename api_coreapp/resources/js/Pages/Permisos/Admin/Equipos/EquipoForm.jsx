import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import { 
    Shield, Users, User, MapPin, Clock, 
    CheckCircle2, AlertCircle, Trophy, Phone, Mail 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquipoForm({ equipo, onSuccess, onCancel }) {
    const [clubes, setClubes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [directivos, setDirectivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        club_id: equipo?.club_id || '',
        categoria_id: equipo?.categoria_id || '',
        nombre_mostrado: equipo?.nombre_mostrado || '',
        cancha_id: equipo?.cancha_id || '',
        cancha_horario_id: equipo?.cancha_horario_id || '',
        directivo_id: equipo?.directivo_id || '',
        activo: equipo?.activo ?? true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resClubes, resCats, resCanchas, resDirectivos] = await Promise.all([
                    http.get('/api/clubs'),
                    http.get('/api/catalogos/categorias'),
                    http.get('/api/canchas'),
                    http.get('/api/directivos/disponibles-para-equipo')
                ]);
                setClubes(resClubes.data);
                setCategorias(resCats.data);
                setCanchas(resCanchas.data);
                
                let disponibles = resDirectivos.data;
                if (equipo?.directivo_id) {
                    const currentRes = await http.get(`/api/directivos/${equipo.directivo_id}`);
                    const exists = disponibles.find(d => d.id === equipo.directivo_id);
                    if (!exists && currentRes.data) {
                        disponibles = [currentRes.data, ...disponibles];
                    }
                }
                setDirectivos(disponibles);
            } catch (error) {
                toast.error('Error al cargar clubes o categorías');
            }
        };
        fetchDependencies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            // Si cambias la cancha, resetear el horario seleccionado
            if (name === 'cancha_id') {
                newData.cancha_horario_id = '';
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (equipo) {
                await http.put(`/api/equipos/${equipo.id}`, formData);
                toast.success('Equipo actualizado correctamente');
            } else {
                await http.post('/api/equipos', formData);
                toast.success('Equipo registrado correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el equipo');
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

    const canchaSeleccionada = canchas.find(c => c.id === formData.cancha_id);
    const horariosDisponibles = canchaSeleccionada ? canchaSeleccionada.horarios : [];

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        return `${h}:${m}`;
    };

    const diaSemanaMap = {
        1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
        5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* ── SECCIÓN: IDENTIDAD DEL EQUIPO ── */}
            <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                    <Shield size={14} /> Información de la Escuadra
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Club u Organización
                        </label>
                        <select
                            name="club_id"
                            value={formData.club_id}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                ...(errors.club_id ? { border: '1px solid var(--color-danger)' } : {})
                            }}
                        >
                            <option value="">Selecciona un Club</option>
                            {clubes.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                        {errors.club_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.club_id[0]}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Categoría de Competencia
                        </label>
                        <select
                            name="categoria_id"
                            value={formData.categoria_id}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                ...(errors.categoria_id ? { border: '1px solid var(--color-danger)' } : {})
                            }}
                        >
                            <option value="">Selecciona una Categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        {errors.categoria_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.categoria_id[0]}</p>}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        Nombre Mostrado del Equipo
                    </label>
                    <input
                        type="text"
                        name="nombre_mostrado"
                        value={formData.nombre_mostrado}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.nombre_mostrado ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="Ej. Real Madrid Sub-15 / Academia FC"
                    />
                    {errors.nombre_mostrado && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.nombre_mostrado[0]}</p>}
                </div>
            </div>

            {/* ── SECCIÓN: REPRESENTACIÓN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <User size={14} /> Delegado Responsable
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select
                        name="directivo_id"
                        value={formData.directivo_id}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.directivo_id ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                    >
                        <option value="">-- Sin delegado asignado --</option>
                        {directivos.map((d) => (
                            <option key={d.id} value={d.id}>{d.nombre} ({d.tipo?.nombre})</option>
                        ))}
                    </select>
                    {errors.directivo_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.directivo_id[0]}</p>}
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', paddingLeft: '4px' }}>
                        El delegado asignado tendrá control sobre la cédula y roster del equipo.
                    </p>
                </div>
            </div>

            {/* ── SECCIÓN: LOGÍSTICA DE LOCALÍA ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <MapPin size={14} /> Sede Habitual
                    </div>
                    <select
                        name="cancha_id"
                        value={formData.cancha_id}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="">Sede para sorteo libre</option>
                        {canchas.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Clock size={14} /> Horario Preferente
                    </div>
                    <select
                        name="cancha_horario_id"
                        value={formData.cancha_horario_id}
                        onChange={handleChange}
                        disabled={!formData.cancha_id || horariosDisponibles.length === 0}
                        style={{
                            ...inputStyle,
                            backgroundColor: (!formData.cancha_id || horariosDisponibles.length === 0) ? 'var(--color-bg-muted)' : 'var(--color-bg-surface)'
                        }}
                    >
                        <option value="">
                            {!formData.cancha_id ? 'Selecciona sede primero' : 
                             horariosDisponibles.length === 0 ? 'Sin horarios' : 
                             'Horario habitual...'}
                        </option>
                        {horariosDisponibles.filter(h => h.activo).map((h) => (
                            <option key={h.id} value={h.id}>
                                {diaSemanaMap[h.dia_semana]} - {formatTime(h.hora)} hrs
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── ESTATUS ── */}
            <div 
                onClick={() => handleChange({ target: { name: 'activo', type: 'checkbox', checked: !formData.activo } })}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px 20px', 
                    background: formData.activo ? 'var(--color-bg-surface-alt)' : 'white', 
                    borderRadius: 'var(--radius-lg)', 
                    border: `1px solid ${formData.activo ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '8px'
                }}
            >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={18} style={{ color: formData.activo ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Equipo Habilitado</span>
                </div>
                <div style={{ 
                    width: '40px', 
                    height: '22px', 
                    backgroundColor: formData.activo ? 'var(--color-primary)' : 'var(--color-border-subtle)', 
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
                        left: formData.activo ? '21px' : '3px',
                        transition: 'all 0.3s'
                    }} />
                </div>
            </div>

            {/* ACCIONES */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading} variant="primary" style={{ padding: '12px 32px' }}>
                    {loading ? 'Procesando...' : (equipo ? 'Actualizar Información' : 'Registrar Equipo')}
                </GradientButton>
            </div>
        </form>
    );
}
