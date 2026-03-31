import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import toast from 'react-hot-toast';

export default function DirectivoForm({ directivo, onSuccess, onCancel }) {
    const [tiposDueno, setTiposDueno] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: directivo?.nombre || '',
        telefono: directivo?.telefono || '',
        direccion: directivo?.direccion || '',
        correo_electronico: directivo?.correo_electronico || '',
        catalogo_tipo_dueno_id: directivo?.catalogo_tipo_dueno_id || '',
        activo: directivo ? directivo.activo : true,
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadTipos = async () => {
            try {
                const res = await http.get('/api/catalogos/tipos-duenos');
                setTiposDueno(res.data);
                if (!directivo && res.data.length > 0) {
                    setFormData(prev => ({ ...prev, catalogo_tipo_dueno_id: res.data[0].id }));
                }
            } catch(e) {
                console.error("Error cargando tipos", e);
            }
        };
        loadTipos();
    }, [directivo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (directivo) {
                await http.put(`/api/directivos/${directivo.id}`, formData);
                toast.success('Directivo actualizado correctamente');
            } else {
                await http.post('/api/directivos', formData);
                toast.success('Directivo registrado correctamente');
            }
            onSuccess();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el directivo');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                    Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    className={`w-full bg-slate-50 border ${errors.nombre ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'} rounded-xl px-4 py-3 text-slate-700 font-medium font-body transition-all focus:ring-4 outline-none`}
                    placeholder="Ej. Juan Pérez"
                    required
                />
                {errors.nombre && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.nombre[0]}</p>}
            </div>

            <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                    Rol / Tipo <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.catalogo_tipo_dueno_id}
                    onChange={e => setFormData({ ...formData, catalogo_tipo_dueno_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium font-body focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all appearance-none"
                    required
                >
                    <option value="">Selecciona rol...</option>
                    {tiposDueno.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                        </option>
                    ))}
                </select>
                {errors.catalogo_tipo_dueno_id && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.catalogo_tipo_dueno_id[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        className={`w-full bg-slate-50 border ${errors.telefono ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-700 font-medium font-body transition-all focus:ring-4 focus:ring-slate-100 outline-none`}
                        placeholder="Ej. 555-123-4567"
                    />
                    {errors.telefono && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.telefono[0]}</p>}
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        value={formData.correo_electronico}
                        onChange={e => setFormData({ ...formData, correo_electronico: e.target.value })}
                        className={`w-full bg-slate-50 border ${errors.correo_electronico ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-700 font-medium font-body transition-all focus:ring-4 focus:ring-slate-100 outline-none`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.correo_electronico && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.correo_electronico[0]}</p>}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                    Dirección
                </label>
                <input
                    type="text"
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                    className={`w-full bg-slate-50 border ${errors.direccion ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-700 font-medium font-body transition-all focus:ring-4 focus:ring-slate-100 outline-none`}
                    placeholder="Dirección completa..."
                />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                        className="peer sr-only"
                        id="activo-toggle"
                    />
                    <label
                        htmlFor="activo-toggle"
                        className="block w-10 h-6 bg-slate-200 rounded-full cursor-pointer transition-colors peer-checked:bg-slate-800"
                    ></label>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                </div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex-1">
                    {formData.activo ? 'Directivo Activo' : 'Directivo Suspendido'}
                </span>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all border border-transparent"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-premium border border-transparent flex justify-center items-center gap-2"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <span>Guardar Directivo</span>
                    )}
                </button>
            </div>
        </form>
    );
}
