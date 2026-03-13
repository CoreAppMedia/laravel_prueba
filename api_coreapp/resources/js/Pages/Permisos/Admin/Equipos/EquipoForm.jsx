import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function EquipoForm({ equipo, onSuccess, onCancel }) {
    const [clubes, setClubes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        club_id: equipo?.club_id || '',
        categoria_id: equipo?.categoria_id || '',
        nombre_mostrado: equipo?.nombre_mostrado || '',
        cancha_id: equipo?.cancha_id || '',
        cancha_horario_id: equipo?.cancha_horario_id || '',
        activo: equipo?.activo ?? true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resClubes, resCats, resCanchas] = await Promise.all([
                    http.get('/api/clubs'),
                    http.get('/api/catalogos/categorias'),
                    http.get('/api/canchas')
                ]);
                setClubes(resClubes.data);
                setCategorias(resCats.data);
                setCanchas(resCanchas.data);
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Club / Organización */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Club / Organización</label>
                <select
                    name="club_id"
                    value={formData.club_id}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.club_id ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.club_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                >
                    <option value="">Selecciona un Club</option>
                    {clubes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.club_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.club_id[0]}</p>}
            </div>

            {/* Categoría */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Categoría de competencia</label>
                <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.categoria_id ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.categoria_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                >
                    <option value="">Selecciona una Categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                {errors.categoria_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.categoria_id[0]}</p>}
            </div>

            {/* Nombre Mostrado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Nombre del Equipo (Ej. Chivas Sub-17)</label>
                <input
                    type="text"
                    name="nombre_mostrado"
                    value={formData.nombre_mostrado}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.nombre_mostrado ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    placeholder="¿Cómo se verá el equipo en las tablas?"
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.nombre_mostrado ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                />
                {errors.nombre_mostrado && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.nombre_mostrado[0]}</p>}
                <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Ejemplo: Si el club es 'América' y la categoría 'Femenil', puedes poner 'América Femenil'.
                </p>
            </div>

            {/* Cancha Local */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Cancha Sede Oficial</label>
                <select
                    name="cancha_id"
                    value={formData.cancha_id}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        ...(errors.cancha_id ? { border: '1px solid var(--color-danger)' } : {})
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.cancha_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                >
                    <option value="">Selecciona una Cancha (Sede Libre)</option>
                    {canchas.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.cancha_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.cancha_id[0]}</p>}
            </div>

            {/* Horario Local */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Horario Local Habitual</label>
                <select
                    name="cancha_horario_id"
                    value={formData.cancha_horario_id}
                    onChange={handleChange}
                    disabled={!formData.cancha_id || horariosDisponibles.length === 0}
                    style={{
                        ...inputStyle,
                        ...(errors.cancha_horario_id ? { border: '1px solid var(--color-danger)' } : {}),
                        backgroundColor: (!formData.cancha_id || horariosDisponibles.length === 0) ? 'var(--color-bg-muted)' : 'var(--color-bg-surface)'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = errors.cancha_horario_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                        e.target.style.boxShadow = 'var(--shadow-soft)';
                    }}
                >
                    <option value="">
                        {!formData.cancha_id ? 'Primero selecciona una cancha' : 
                         horariosDisponibles.length === 0 ? 'La cancha no tiene horarios configurados' : 
                         'Selecciona un horario...'}
                    </option>
                    {horariosDisponibles.filter(h => h.activo).map((h) => (
                        <option key={h.id} value={h.id}>
                            {diaSemanaMap[h.dia_semana]} - {formatTime(h.hora)} hrs
                        </option>
                    ))}
                </select>
                {errors.cancha_horario_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.cancha_horario_id[0]}</p>}
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
                    Equipo Activo para Torneos actuales
                </label>
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
                    {loading ? 'Procesando...' : (equipo ? 'Guardar Cambios' : 'Registrar Equipo')}
                </GradientButton>
            </div>
        </form>
    );
}
