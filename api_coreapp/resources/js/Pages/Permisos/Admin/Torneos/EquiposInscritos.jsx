import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { Plus, Check, X, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquiposInscritos({ torneo }) {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState('');
    const [pagadoInscripcion, setPagadoInscripcion] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchEquiposInscritos = async () => {
        setLoading(true);
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/equipos-inscritos`);
            setEquipos(response.data);
        } catch (error) {
            toast.error('Error al cargar equipos inscritos');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquiposDisponibles = async () => {
        try {
            const response = await http.get('/api/equipos');
            // Filter out teams that don't match the tournament category visually (although API will validate it)
            // Or just load them all and let the user see visually if they match
            setEquiposDisponibles(response.data);
        } catch (error) {
            toast.error('Error al cargar equipos disponibles');
        }
    };

    useEffect(() => {
        fetchEquiposInscritos();
        fetchEquiposDisponibles();
    }, [torneo.id]);

    const handleInscriptionSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/torneos/${torneo.id}/inscribir`, {
                equipo_id: selectedEquipoId,
                pagado_inscripcion: pagadoInscripcion
            });
            toast.success('Equipo inscrito con éxito');
            setIsModalOpen(false);
            setSelectedEquipoId('');
            setPagadoInscripcion(false);
            fetchEquiposInscritos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al inscribir el equipo');
        } finally {
            setSaving(false);
        }
    };

    const togglePago = async (equipoId, currentStatus) => {
        try {
            await http.patch(`/api/torneos/${torneo.id}/equipos/${equipoId}/pago`, {
                pagado_inscripcion: !currentStatus
            });
            toast.success('Estatus de pago actualizado');
            fetchEquiposInscritos();
        } catch (error) {
            toast.error('Error al actualizar pago');
        }
    };

    const columns = [
        {
            header: 'Equipo',
            accessor: 'nombre_mostrado',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Users size={14} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800">{row.nombre_mostrado}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1">
                            <Shield size={10} />
                            {row.club?.nombre || 'Independiente'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            render: (row) => (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    torneo.categoria_id === row.categoria_id 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {row.categoria?.nombre || 'General'}
                    {torneo.categoria_id !== row.categoria_id && ' (Incompatible)'}
                </span>
            )
        },
        {
            header: 'Fecha de Inscripción',
            render: (row) => (
                <span className="text-sm text-slate-600">
                    {new Date(row.pivot.fecha_inscripcion).toLocaleDateString()}
                </span>
            )
        },
        {
            header: 'Estado de Pago',
            render: (row) => {
                const isPaid = row.pivot.pagado_inscripcion;
                return (
                    <button 
                        onClick={() => togglePago(row.id, isPaid)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                            isPaid 
                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                                : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                        }`}
                        title="Clic para cambiar estatus"
                    >
                        {isPaid ? <Check size={14} /> : <X size={14} />}
                        {isPaid ? 'Pagado' : 'Pendiente'}
                    </button>
                );
            }
        }
    ];

    // Filter out teams that are already inscribed to avoiding showing them in the dropdown
    const equiposFiltrados = equiposDisponibles.filter(
        ed => !equipos.some(ei => ei.id === ed.id)
    );

    return (
        <Card title="Equipos Inscritos">
            <div className="flex justify-end mb-4">
                <GradientButton 
                    onClick={() => setIsModalOpen(true)} 
                    icon={Plus}
                >
                    Inscribir Equipo
                </GradientButton>
            </div>

            {loading ? (
                <div className="text-center py-8 text-slate-400 italic">Cargando equipos...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={equipos}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Inscripción"
            >
                <form onSubmit={handleInscriptionSubmit} className="space-y-4">
                    {torneo.categoria && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl text-xs flex flex-col gap-1">
                            <span className="font-bold">Información Importante</span>
                            <span>Este torneo es exclusivo para la categoría: <strong>{torneo.categoria.nombre}</strong>. Solo puedes inscribir equipos que pertenezcan a esta categoría.</span>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 tracking-tight">Seleccionar Equipo</label>
                        <select 
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green bg-slate-50 text-slate-800 transition-all font-medium appearance-none"
                            value={selectedEquipoId}
                            onChange={(e) => setSelectedEquipoId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un equipo disponible...</option>
                            {equiposFiltrados.map(eq => {
                                const isCompatible = !torneo.categoria_id || eq.categoria_id === torneo.categoria_id;
                                return (
                                    <option key={eq.id} value={eq.id} disabled={!isCompatible}>
                                        {eq.nombre_mostrado} {eq.categoria ? `(${eq.categoria.nombre})` : ''} {!isCompatible ? '- Categoría no compatible' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input 
                            type="checkbox" 
                            id="pagado_inscripcion"
                            checked={pagadoInscripcion}
                            onChange={(e) => setPagadoInscripcion(e.target.checked)}
                            className="w-4 h-4 text-mx-green rounded focus:ring-mx-green"
                        />
                        <label htmlFor="pagado_inscripcion" className="text-sm font-bold text-slate-700">
                            Marcar inscripción como pagada ahora
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Cancelar
                        </button>
                        <GradientButton
                            type="submit"
                            disabled={saving || !selectedEquipoId}
                            isLoading={saving}
                            icon={Plus}
                        >
                            Inscribir
                        </GradientButton>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
