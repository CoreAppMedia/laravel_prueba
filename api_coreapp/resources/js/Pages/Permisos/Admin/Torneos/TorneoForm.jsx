import React, { useState, useEffect } from "react";
import http from "../../../../lib/http";
import GradientButton from "../../../../Components/UI/GradientButton";
import toast from "react-hot-toast";

export default function TorneoForm({ torneo, onSuccess, onCancel }) {
    const [temporadas, setTemporadas] = useState([]);
    const [tiposTorneo, setTiposTorneo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        temporada_id: torneo?.temporada_id || "",
        catalogo_tipo_torneo_id: torneo?.catalogo_tipo_torneo_id || "",
        nombre: torneo?.nombre || "",
        fecha_inicio: torneo?.fecha_inicio || "",
        fecha_fin: torneo?.fecha_fin || "",
        costo_inscripcion: torneo?.costo_inscripcion || 0,
        costo_arbitraje_por_partido: torneo?.costo_arbitraje_por_partido || 0,
        estatus: torneo?.estatus || "Planeación",
        es_abierto: torneo?.es_abierto ?? true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resTemp, resTipos] = await Promise.all([
                    http.get("/api/temporadas"),
                    http.get("/api/catalogos/tipos-torneo"),
                ]);
                setTemporadas(resTemp.data);
                setTiposTorneo(resTipos.data);
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

    const inputClass = "w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-mx-green/20 focus:border-mx-green outline-none transition-all font-medium shadow-sm";
    const labelClass = "block text-sm font-black text-slate-700 mb-1 tracking-tight";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Temporada</label>
                    <select
                        name="temporada_id"
                        value={formData.temporada_id}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">Selecciona Temporada</option>
                        {temporadas.map((temp) => (
                            <option key={temp.id} value={temp.id}>{temp.nombre}</option>
                        ))}
                    </select>
                    {errors.temporada_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.temporada_id[0]}</p>}
                </div>
                <div>
                    <label className={labelClass}>Tipo de Torneo</label>
                    <select
                        name="catalogo_tipo_torneo_id"
                        value={formData.catalogo_tipo_torneo_id}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">Selecciona Tipo</option>
                        {tiposTorneo.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                    </select>
                    {errors.catalogo_tipo_torneo_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.catalogo_tipo_torneo_id[0]}</p>}
                </div>
            </div>

            <div>
                <label className={labelClass}>Nombre del Torneo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. Liga Premier 2026"
                />
                {errors.nombre && <p className="text-red-600 text-xs mt-1 font-bold">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Fecha Inicio</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className={inputClass}
                    />
                    {errors.fecha_inicio && <p className="text-red-600 text-xs mt-1 font-bold">{errors.fecha_inicio[0]}</p>}
                </div>
                <div>
                    <label className={labelClass}>Fecha Fin</label>
                    <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className={inputClass}
                    />
                    {errors.fecha_fin && <p className="text-red-600 text-xs mt-1 font-bold">{errors.fecha_fin[0]}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Costo Inscripción ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_inscripcion"
                        value={formData.costo_inscripcion}
                        onChange={handleChange}
                        className={inputClass}
                    />
                    {errors.costo_inscripcion && <p className="text-red-600 text-xs mt-1 font-bold">{errors.costo_inscripcion[0]}</p>}
                </div>
                <div>
                    <label className={labelClass}>Arbitraje por Partido ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_arbitraje_por_partido"
                        value={formData.costo_arbitraje_por_partido}
                        onChange={handleChange}
                        className={inputClass}
                    />
                    {errors.costo_arbitraje_por_partido && <p className="text-red-600 text-xs mt-1 font-bold">{errors.costo_arbitraje_por_partido[0]}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Estatus</label>
                    <select
                        name="estatus"
                        value={formData.estatus}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="Planeación">Planeación</option>
                        <option value="En Inscripción">En Inscripción</option>
                        <option value="En Curso">En Curso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
                <div className="flex items-center mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <input
                        type="checkbox"
                        id="es_abierto"
                        name="es_abierto"
                        checked={formData.es_abierto}
                        onChange={handleChange}
                        className="w-5 h-5 text-mx-green bg-white border-slate-300 rounded-lg focus:ring-mx-green focus:ring-2 transition-all cursor-pointer"
                    />
                    <label htmlFor="es_abierto" className="ml-3 text-sm font-black text-slate-700 cursor-pointer">
                        Torneo Abierto (Público)
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest"
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (torneo ? 'Actualizar Torneo' : 'Crear Torneo')}
                </GradientButton>
            </div>
        </form>
    );
}
