import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function TorneoForm({ torneo, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        temporada_id: torneo?.temporada_id || '',
        tipo_torneo_id: torneo?.tipo_torneo_id || '',
        nombre: torneo?.nombre || '',
        fecha_inicio: torneo?.fecha_inicio || '',
        fecha_fin: torneo?.fecha_fin || '',
        es_abierto: torneo?.es_abierto ?? false,
        costo_inscripcion: torneo?.costo_inscripcion || 0,
        costo_arbitraje_por_partido: torneo?.costo_arbitraje_por_partido || 0,
        estatus: torneo?.estatus || 'Planeación',
    });

    const [temporadas, setTemporadas] = useState([]);
    const [tiposTorneo, setTiposTorneo] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resTemp, resTipos] = await Promise.all([
                    http.get('/api/temporadas'),
                    http.get('/api/catalogos/tipos-torneo')
                ]);
                setTemporadas(resTemp.data);
                setTiposTorneo(resTipos.data);
            } catch (error) {
                toast.error('Error al cargar dependencias del formulario');
            }
        };
        fetchDependencies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (torneo) {
                await http.put(`/api/torneos/${torneo.id}`, formData);
                toast.success('Torneo actualizado exitosamente');
            } else {
                await http.post('/api/torneos', formData);
                toast.success('Torneo creado exitosamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                toast.error('Por favor revisa los campos del formulario');
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Temporada</label>
                    <select
                        name="temporada_id"
                        value={formData.temporada_id}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    >
                        <option value="">Selecciona una temporada</option>
                        {temporadas.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                    {errors.temporada_id && <p className="text-red-400 text-xs mt-1">{errors.temporada_id[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Torneo</label>
                    <select
                        name="tipo_torneo_id"
                        value={formData.tipo_torneo_id}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    >
                        <option value="">Selecciona tipo</option>
                        {tiposTorneo.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                    </select>
                    {errors.tipo_torneo_id && <p className="text-red-400 text-xs mt-1">{errors.tipo_torneo_id[0]}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Torneo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    placeholder="Ej. Liga Premier 2026"
                />
                {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha Inicio</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    />
                    {errors.fecha_inicio && <p className="text-red-400 text-xs mt-1">{errors.fecha_inicio[0]}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha Fin</label>
                    <input
                        type="date"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    />
                    {errors.fecha_fin && <p className="text-red-400 text-xs mt-1">{errors.fecha_fin[0]}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Costo Inscripción ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_inscripcion"
                        value={formData.costo_inscripcion}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    />
                    {errors.costo_inscripcion && <p className="text-red-400 text-xs mt-1">{errors.costo_inscripcion[0]}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Arbitraje por Partido ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="costo_arbitraje_por_partido"
                        value={formData.costo_arbitraje_por_partido}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    />
                    {errors.costo_arbitraje_por_partido && <p className="text-red-400 text-xs mt-1">{errors.costo_arbitraje_por_partido[0]}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Estatus</label>
                    <select
                        name="estatus"
                        value={formData.estatus}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    >
                        <option value="Planeación">Planeación</option>
                        <option value="En Inscripción">En Inscripción</option>
                        <option value="En Curso">En Curso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
                <div className="flex items-center mt-6">
                    <input
                        type="checkbox"
                        id="es_abierto"
                        name="es_abierto"
                        checked={formData.es_abierto}
                        onChange={handleChange}
                        className="w-4 h-4 text-mx-green bg-slate-900 border-slate-700 rounded focus:ring-mx-green focus:ring-2"
                    />
                    <label htmlFor="es_abierto" className="ml-2 text-sm font-medium text-slate-300">
                        Torneo Abierto (Público)
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6 pb-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
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
