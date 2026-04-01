import React, { useState, useEffect } from "react";
import http from "../../../../lib/http";
import GradientButton from "../../../../Components/UI/GradientButton";
import { 
    Trophy, Calendar, Users, DollarSign, Clock, MapPin, 
    CheckCircle2, AlertCircle, Shield 
} from "lucide-react";
import toast from "react-hot-toast";

function TorneoForm({ torneo, onSuccess, onCancel }) {
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* ── SECCIÓN: IDENTIDAD DEL TORNEO ── */}
            <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                    <Trophy size={14} /> Información General
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Temporada Vigilante
                        </label>
                        <select
                            name="temporada_id"
                            value={formData.temporada_id}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                ...(errors.temporada_id ? { border: '1px solid var(--color-danger)' } : {})
                            }}
                        >
                            <option value="">Selecciona Temporada</option>
                            {temporadas.map((temp) => (
                                <option key={temp.id} value={temp.id}>{temp.nombre}</option>
                            ))}
                        </select>
                        {errors.temporada_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.temporada_id[0]}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Tipo de Competencia
                        </label>
                        <select
                            name="tipo_torneo_id"
                            value={formData.tipo_torneo_id}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                ...(errors.tipo_torneo_id ? { border: '1px solid var(--color-danger)' } : {})
                            }}
                        >
                            <option value="">Selecciona Tipo</option>
                            {tiposTorneo.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                            ))}
                        </select>
                        {errors.tipo_torneo_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.tipo_torneo_id[0]}</p>}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Nombre Oficial del Torneo
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
                            placeholder="Ej. Torneo Apertura 2026"
                        />
                        {errors.nombre && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.nombre[0]}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            Categoría
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
                            <option value="">Selecciona...</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        {errors.categoria_id && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{errors.categoria_id[0]}</p>}
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: CALENDARIO Y DÍAS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Calendar size={14} /> Fechas de Operación
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fecha de Inicio</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} style={inputStyle} />
                            {errors.fecha_inicio && <p style={{ color: 'var(--color-danger)', fontSize: '11px' }}>{errors.fecha_inicio[0]}</p>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Clausura</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} style={inputStyle} />
                            {errors.fecha_fin && <p style={{ color: 'var(--color-danger)', fontSize: '11px' }}>{errors.fecha_fin[0]}</p>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Clock size={14} /> Días de Competencia
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {diasSemana.map((dia) => {
                            const isSelected = formData.dias_juego?.includes(dia.id);
                            return (
                                <div
                                    key={dia.id}
                                    onClick={() => toggleDia(dia.id)}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid',
                                        borderColor: isSelected ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                                        backgroundColor: isSelected ? 'var(--color-gold-light)' : 'white',
                                        color: isSelected ? 'var(--color-slate)' : 'var(--color-text-muted)',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {dia.nombre.substring(0, 2)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: FINANZAS Y ARBITRAJE ── */}
            <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                    <DollarSign size={14} /> Configuración de Aranceles
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Inscripción de Equipo</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>$</span>
                            <input type="number" step="0.01" name="costo_inscripcion" value={formData.costo_inscripcion} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '28px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Arbitraje por Partido</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>$</span>
                            <input type="number" step="0.01" name="costo_arbitraje_por_partido" value={formData.costo_arbitraje_por_partido} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '28px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Pago Base Árbitro</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>$</span>
                            <input type="number" step="0.01" name="monto_pago_arbitro" value={formData.monto_pago_arbitro} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '28px' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: ESTATUS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--color-sage)' }} /> Estado de Operación
                    </label>
                    <select name="estatus" value={formData.estatus} onChange={handleChange} style={inputStyle}>
                        <option value="Planeación">Planeación / Borrador</option>
                        <option value="En Inscripción">Periodo de Inscripción</option>
                        <option value="En Curso">En Curso (Activo)</option>
                        <option value="Finalizado">Concluido</option>
                    </select>
                </div>
                
                <div 
                    onClick={() => handleChange({ target: { name: 'es_abierto', type: 'checkbox', checked: !formData.es_abierto } })}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '16px 20px', 
                        background: formData.es_abierto ? 'var(--color-bg-surface-alt)' : 'white', 
                        borderRadius: 'var(--radius-lg)', 
                        border: `1px solid ${formData.es_abierto ? 'var(--color-gold)' : 'var(--color-border-subtle)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        alignSelf: 'end',
                        height: '52px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={18} style={{ color: formData.es_abierto ? 'var(--color-gold)' : 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Torneo Público</span>
                    </div>
                    <div style={{ 
                        width: '40px', 
                        height: '22px', 
                        backgroundColor: formData.es_abierto ? 'var(--color-gold)' : 'var(--color-border-subtle)', 
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
                            left: formData.es_abierto ? '21px' : '3px',
                            transition: 'all 0.3s'
                        }} />
                    </div>
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
                    {loading ? 'Guardando...' : (torneo ? 'Actualizar Torneo' : 'Crear Nuevo Torneo')}
                </GradientButton>
            </div>
        </form>
    );
}

export default TorneoForm;
