import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function EquipoForm({ equipo, onSuccess, onCancel }) {
    const [clubes, setClubes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        club_id: equipo?.club_id || '',
        categoria_id: equipo?.categoria_id || '',
        nombre_mostrado: equipo?.nombre_mostrado || '',
        activo: equipo?.activo ?? true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resClubes, resCats] = await Promise.all([
                    http.get('/api/clubs'),
                    http.get('/api/catalogos/categorias')
                ]);
                setClubes(resClubes.data);
                setCategorias(resCats.data);
            } catch (error) {
                toast.error('Error al cargar clubes o categorías');
            }
        };
        fetchDependencies();
    }, []);

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

    const inputClass = "w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-mx-green/20 focus:border-mx-green outline-none transition-all font-medium shadow-sm";
    const labelClass = "block text-sm font-black text-slate-700 mb-1 tracking-tight";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={labelClass}>Club / Organización</label>
                <select
                    name="club_id"
                    value={formData.club_id}
                    onChange={handleChange}
                    className={inputClass}
                >
                    <option value="">Selecciona un Club</option>
                    {clubes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.club_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.club_id[0]}</p>}
            </div>

            <div>
                <label className={labelClass}>Categoría</label>
                <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className={inputClass}
                >
                    <option value="">Selecciona una Categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                {errors.categoria_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.categoria_id[0]}</p>}
            </div>

            <div>
                <label className={labelClass}>Nombre Mostrado (Ej. Chivas Sub-17)</label>
                <input
                    type="text"
                    name="nombre_mostrado"
                    value={formData.nombre_mostrado}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="¿Cómo se verá el equipo en las tablas?"
                />
                {errors.nombre_mostrado && <p className="text-red-600 text-xs mt-1 font-bold">{errors.nombre_mostrado[0]}</p>}
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight italic">
                    Ejemplo: Si el club es 'América' y la categoría 'Femenil', puedes poner 'América Femenil'.
                </p>
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
                    Equipo Activo para Torneos
                </label>
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
                    {loading ? 'Guardando...' : (equipo ? 'Actualizar Equipo' : 'Registrar Equipo')}
                </GradientButton>
            </div>
        </form>
    );
}
