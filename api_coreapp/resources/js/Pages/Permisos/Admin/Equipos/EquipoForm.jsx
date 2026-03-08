import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import GradientButton from '../../../../Components/UI/GradientButton';
import toast from 'react-hot-toast';

export default function EquipoForm({ equipo, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        club_id: equipo?.club_id || '',
        categoria_id: equipo?.categoria_id || '',
        nombre_mostrado: equipo?.nombre_mostrado || '',
        activo: equipo?.activo ?? true,
    });

    const [clubes, setClubes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
                toast.error('Error al cargar catálogos para equipos');
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
            if (equipo) {
                await http.put(`/api/equipos/${equipo.id}`, formData);
                toast.success('Equipo actualizado exitosamente');
            } else {
                await http.post('/api/equipos', formData);
                toast.success('Equipo registrado exitosamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
                // El backend ya tiene la lógica de anti-duplicación y devuelve un mensaje claro
                const mainError = error.response.data.errors.club_id || error.response.data.errors.categoria_id;
                if (mainError) toast.error(mainError[0]);
                else toast.error('Error de validación en los datos');
            } else {
                toast.error('Ocurrió un error inesperado al guardar el equipo');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Club / Organización</label>
                <select
                    name="club_id"
                    value={formData.club_id}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                >
                    <option value="">Selecciona organización</option>
                    {clubes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errors.club_id && <p className="text-red-400 text-xs mt-1">{errors.club_id[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                >
                    <option value="">Selecciona categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                {errors.categoria_id && <p className="text-red-400 text-xs mt-1">{errors.categoria_id[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Mostrado (Ej. Chivas Sub-17)</label>
                <input
                    type="text"
                    name="nombre_mostrado"
                    value={formData.nombre_mostrado}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-2 text-white focus:ring-mx-green focus:border-mx-green outline-none"
                    placeholder="¿Cómo se verá el equipo en las tablas?"
                />
                {errors.nombre_mostrado && <p className="text-red-400 text-xs mt-1">{errors.nombre_mostrado[0]}</p>}
                <p className="text-[10px] text-slate-500 mt-1 italic italic">Ejemplo: Si el club es 'América' y la categoría 'Femenil', puedes poner 'América Femenil'.</p>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-mx-green bg-slate-900 border-slate-700 rounded focus:ring-mx-green focus:ring-2"
                />
                <label htmlFor="activo" className="ml-2 text-sm font-medium text-slate-300">
                    Equipo Activo para Torneos
                </label>
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
                    {loading ? 'Guardando...' : (equipo ? 'Actualizar Equipo' : 'Registrar Equipo')}
                </GradientButton>
            </div>
        </form>
    );
}
