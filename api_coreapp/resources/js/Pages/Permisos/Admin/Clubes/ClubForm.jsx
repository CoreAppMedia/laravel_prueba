import React, { useState } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function ClubForm({ club, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: club?.nombre || '',
        es_club: club?.es_club ?? true,
        telefono: club?.telefono || '',
        correo: club?.correo || '',
        activo: club?.activo ?? true
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
            if (club) {
                await http.put(`/api/clubs/${club.id}`, formData);
                toast.success('Información del club actualizada');
            } else {
                await http.post('/api/clubs', formData);
                toast.success('Club registrado correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el club');
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
                <label className={labelClass}>Nombre del Club / Equipo</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. Real Sociedad"
                />
                {errors.nombre && <p className="text-red-600 text-xs mt-1 font-bold">{errors.nombre[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ej. 5512345678"
                    />
                    {errors.telefono && <p className="text-red-600 text-xs mt-1 font-bold">{errors.telefono[0]}</p>}
                </div>
                <div>
                    <label className={labelClass}>Correo Electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="contacto@club.com"
                    />
                    {errors.correo && <p className="text-red-600 text-xs mt-1 font-bold">{errors.correo[0]}</p>}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <input
                        type="checkbox"
                        id="es_club"
                        name="es_club"
                        checked={formData.es_club}
                        onChange={handleChange}
                        className="w-5 h-5 text-mx-green bg-white border-slate-300 rounded-lg focus:ring-mx-green focus:ring-2 transition-all cursor-pointer"
                    />
                    <label htmlFor="es_club" className="ml-3 text-sm font-black text-slate-700 cursor-pointer">
                        ¿Es un Club consolidado? (Tiene múltiples equipos)
                    </label>
                </div>

                <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <input
                        type="checkbox"
                        id="activo"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        className="w-5 h-5 text-mx-green bg-white border-slate-300 rounded-lg focus:ring-mx-green focus:ring-2 transition-all cursor-pointer"
                    />
                    <label htmlFor="activo" className="ml-3 text-sm font-black text-slate-700 cursor-pointer">
                        Registro Activo
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
                    {loading ? 'Guardando...' : (club ? 'Actualizar Información' : 'Registrar Club')}
                </GradientButton>
            </div>
        </form>
    );
}
