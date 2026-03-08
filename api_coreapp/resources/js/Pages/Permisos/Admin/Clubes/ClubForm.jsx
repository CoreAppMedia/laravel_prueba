import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function ClubForm({ club, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nombre: club?.nombre || '',
        es_club: club?.es_club ?? true,
        telefono: club?.telefono || '',
        correo: club?.correo || '',
        activo: club?.activo ?? true,
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
            if (club) {
                await http.put(`/api/clubs/${club.id}`, formData);
                toast.success('Club actualizado exitosamente');
            } else {
                await http.post('/api/clubs', formData);
                toast.success('Club creado exitosamente');
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Club / Equipo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
                />
                {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
                    />
                    {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono[0]}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none transition-colors"
                    />
                    {errors.correo && <p className="text-red-400 text-xs mt-1">{errors.correo[0]}</p>}
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="es_club"
                        name="es_club"
                        checked={formData.es_club}
                        onChange={handleChange}
                        className="w-4 h-4 text-mx-green bg-slate-900 border-slate-700 rounded focus:ring-mx-green focus:ring-2"
                    />
                    <label htmlFor="es_club" className="ml-2 text-sm font-medium text-slate-300">
                        ¿Es un Club consolidado? (Tiene múltiples equipos)
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="activo"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        className="w-4 h-4 text-mx-green bg-slate-900 border-slate-700 rounded focus:ring-mx-green focus:ring-2"
                    />
                    <label htmlFor="activo" className="ml-2 text-sm font-medium text-slate-300">
                        Registro Activo
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
                <GradientButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (club ? 'Actualizar' : 'Guardar')}
                </GradientButton>
            </div>
        </form>
    );
}
