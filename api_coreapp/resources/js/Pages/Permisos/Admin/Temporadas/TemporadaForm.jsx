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

    const inputClass = "w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-mx-green/20 focus:border-mx-green outline-none transition-all font-medium shadow-sm";
    const labelClass = "block text-sm font-black text-slate-700 mb-1 tracking-tight";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={labelClass}>Nombre de la Temporada</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. Apertura 2026"
                />
                {errors.nombre && <p className="text-red-600 text-xs mt-1 font-bold">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                <input
                    type="checkbox"
                    id="activa"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleChange}
                    className="w-5 h-5 text-mx-green bg-white border-slate-300 rounded-lg focus:ring-mx-green focus:ring-2 transition-all cursor-pointer"
                />
                <label htmlFor="activa" className="ml-3 text-sm font-black text-slate-700 cursor-pointer">
                    Temporada Activa
                </label>
            </div>
            {errors.activa && <p className="text-red-600 text-xs mt-1 font-bold">{errors.activa[0]}</p>}

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest"
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (temporada ? 'Actualizar' : 'Crear Temporada')}
                </GradientButton>
            </div>
        </form>
    );
}
