import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function TemporadaForm({ temporada, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nombre: temporada?.nombre || '',
        fecha_inicio: temporada?.fecha_inicio || '',
        fecha_fin: temporada?.fecha_fin || '',
        activa: temporada?.activa || false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            if (temporada) {
                await http.put(`/api/temporadas/${temporada.id}`, formData);
                toast.success('Temporada actualizada exitosamente');
            } else {
                await http.post('/api/temporadas', formData);
                toast.success('Temporada creada exitosamente');
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre (e.g. Apertura 2027)</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
                />
                {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha Inicio</label>
                    <input
                        type="date"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
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
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
                    />
                    {errors.fecha_fin && <p className="text-red-400 text-xs mt-1">{errors.fecha_fin[0]}</p>}
                </div>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="activa"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleChange}
                    className="w-4 h-4 text-mx-green bg-slate-900 border-slate-700 rounded focus:ring-mx-green focus:ring-2"
                />
                <label htmlFor="activa" className="ml-2 text-sm font-medium text-slate-300">
                    Temporada Activa
                </label>
            </div>
            {errors.activa && <p className="text-red-400 text-xs mt-1">{errors.activa[0]}</p>}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (temporada ? 'Actualizar' : 'Guardar')}
                </GradientButton>
            </div>
        </form>
    );
}
