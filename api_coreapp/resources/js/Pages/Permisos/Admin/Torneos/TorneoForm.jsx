import React, { useState, useEffect } from "react";
import http from "../../../../lib/http";
import GradientButton from "../../../../Components/UI/GradientButton";
import toast from "react-hot-toast";

export default function TorneoForm({ torneo, onSuccess, onCancel }) {
    const [temporadas, setTemporadas] = useState([]);
    const [tiposTorneo, setTiposTorneo] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        temporada_id: torneo?.temporada_id || "",
        tipo_torneo_id: torneo?.tipo_torneo_id || "",
        categoria_id: torneo?.categoria_id || "",
        nombre: torneo?.nombre || "",
        fecha_inicio: torneo?.fecha_inicio || "",
        fecha_fin: torneo?.fecha_fin || "",
        costo_inscripcion: torneo?.costo_inscripcion || 0,
        costo_arbitraje_por_partido: torneo?.costo_arbitraje_por_partido || 0,
        monto_pago_arbitro: torneo?.monto_pago_arbitro || 0,
        estatus: torneo?.estatus || "Planeación",
        es_abierto: torneo?.es_abierto ?? true,
        dias_juego: torneo?.dias_juego || [],
    });

    const diasSemana = [
        { id: 1, nombre: 'Lun' },
        { id: 2, nombre: 'Mar' },
        { id: 3, nombre: 'Mié' },
        { id: 4, nombre: 'Jue' },
        { id: 5, nombre: 'Vie' },
        { id: 6, nombre: 'Sáb' },
        { id: 7, nombre: 'Dom' },
    ];

    const toggleDia = (diaId) => {
        setFormData(prev => {
            const current = [...(prev.dias_juego || [])];
            const index = current.indexOf(diaId);
            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(diaId);
            }
            return { ...prev, dias_juego: current.sort((a, b) => a - b) };
        });
    };

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resTemp, resTipos, resCats] = await Promise.all([
                    http.get("/api/temporadas"),
                    http.get("/api/catalogos/tipos-torneo"),
                    http.get("/api/catalogos/categorias"),
                ]);
                setTemporadas(resTemp.data);
                setTiposTorneo(resTipos.data);
                setCategorias(resCats.data);
            } catch (error) {
                toast.error("Error al cargar datos necesarios");
            }
        };
        fetchDependencies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (torneo) {
                await http.put(`/api/torneos/${torneo.id}`, formData);
                toast.success("Torneo actualizado correctamente");
            } else {
                await http.post("/api/torneos", formData);
                toast.success("Torneo creado correctamente");
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error("Error al guardar el torneo");
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
            {/* Fila 1: Temporada y Tipo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Temporada</label>
                    <select
                        name="temporada_id"
                        value={formData.temporada_id}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.temporada_id ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.temporada_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    >
                        <option value="">Selecciona Temporada</option>
                        {temporadas.map((temp) => (
                            <option key={temp.id} value={temp.id}>{temp.nombre}</option>
                        ))}
                    </select>
                    {errors.temporada_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.temporada_id[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Tipo de Torneo</label>
                    <select
                        name="tipo_torneo_id"
                        value={formData.tipo_torneo_id}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.tipo_torneo_id ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.tipo_torneo_id ? 'var(--color-danger)' : 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    >
                        <option value="">Selecciona Tipo</option>
                        {tiposTorneo.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                    </select>
                    {errors.tipo_torneo_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.tipo_torneo_id[0]}</p>}
                </div>
            </div>

            {/* Fila: Nombre y Categoría */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Nombre Identificador del Torneo</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            ...(errors.nombre ? { border: '1px solid var(--color-danger)' } : {})
                        }}
                        placeholder="Ej. Liga Premier 2026"
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Categoría</label>
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
                        <option value="">Selecciona...</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    {errors.categoria_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.categoria_id[0]}</p>}
                </div>
            </div>

            {/* Fila: Calendario */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Fecha de Inicio</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.fecha_inicio && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.fecha_inicio[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Fecha de Clausura</label>
                    <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.fecha_fin && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.fecha_fin[0]}</p>}
                </div>
            </div>

            {/* Fila: Días de Juego */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className={labelClass} style={{ marginLeft: '4px' }}>Días de Competencia Autorizados</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {diasSemana.map((dia) => {
                        const isSelected = formData.dias_juego?.includes(dia.id);
                        return (
                            <div
                                key={dia.id}
                                onClick={() => toggleDia(dia.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid',
                                    borderColor: isSelected ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                                    backgroundColor: isSelected ? 'var(--color-gold-light)' : 'var(--color-bg-surface)',
                                    color: isSelected ? 'var(--color-slate)' : 'var(--color-text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: isSelected ? 800 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                    minWidth: '60px',
                                    boxShadow: isSelected ? 'var(--shadow-soft)' : 'none',
                                    userSelect: 'none'
                                }}
                            >
                                {dia.nombre}
                            </div>
                        );
                    })}
                </div>
                {errors.dias_juego && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.dias_juego[0]}</p>}
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                    Indica qué días de la semana se permite programar encuentros para este torneo.
                </p>
            </div>

            {/* Fila: Costos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Costo Inscripción ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_inscripcion"
                        value={formData.costo_inscripcion}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.costo_inscripcion && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.costo_inscripcion[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Arbitraje por Equipo ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_arbitraje_por_partido"
                        value={formData.costo_arbitraje_por_partido}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.costo_arbitraje_por_partido && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.costo_arbitraje_por_partido[0]}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Pago a Árbitro (Base ($))</label>
                    <input
                        type="number"
                        step="0.01"
                        name="monto_pago_arbitro"
                        value={formData.monto_pago_arbitro}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    />
                    {errors.monto_pago_arbitro && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px', marginLeft: '4px' }}>{errors.monto_pago_arbitro[0]}</p>}
                </div>
            </div>

            {/* Fila: Estatus y Apertura */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className={labelClass} style={{ marginLeft: '4px' }}>Estatus de Operación</label>
                    <select
                        name="estatus"
                        value={formData.estatus}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-gold)';
                            e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border-subtle)';
                            e.target.style.boxShadow = 'var(--shadow-soft)';
                        }}
                    >
                        <option value="Planeación">Planeación</option>
                        <option value="En Inscripción">En Inscripción</option>
                        <option value="En Curso">En Curso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        background: 'var(--color-bg-surface-alt)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginTop: 'auto',
                        height: '46px'
                    }}
                    onClick={() => handleChange({ target: { name: 'es_abierto', type: 'checkbox', checked: !formData.es_abierto } })}
                >
                    <input
                        type="checkbox"
                        id="es_abierto"
                        name="es_abierto"
                        checked={formData.es_abierto}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-terra)', cursor: 'pointer' }}
                    />
                    <label htmlFor="es_abierto" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        Torneo Abierto (Público)
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
                    {loading ? 'Procesando...' : (torneo ? 'Actualizar Configuración' : 'Crear Torneo')}
                </GradientButton>
            </div>
        </form>
    );
}
