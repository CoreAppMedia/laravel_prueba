import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import TemporadaForm from './TemporadaForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TemporadasIndex() {
    const [temporadas, setTemporadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingTemporada, setEditingTemporada] = useState(null);
    const [selectedTemporada, setSelectedTemporada] = useState(null);

    const fetchTemporadas = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/temporadas');
            setTemporadas(response.data);
        } catch (error) {
            toast.error('Error al cargar temporadas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemporadas();
    }, []);

    const handleCreate = () => {
        setEditingTemporada(null);
        setIsModalOpen(true);
    };

    const handleEdit = (temporada) => {
        setEditingTemporada(temporada);
        setIsModalOpen(true);
    };

    const handleRowClick = (temporada) => {
        setSelectedTemporada(temporada);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta temporada?')) return;

        try {
            await http.delete(`/api/temporadas/${id}`);
            toast.success('Temporada eliminada correctamente');
            fetchTemporadas();
        } catch (error) {
            toast.error('Error al eliminar temporada');
        }
    };

    const columns = [
        {
            header: 'Nombre de Edición',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight">
                        {row.nombre}
                    </span>
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {row.activa ? '🟢 Activa' : '⚪ Inactiva'}
                    </span>
                </div>
            )
        },
        {
            header: 'Fecha Inicio',
            accessor: 'fecha_inicio',
            hiddenMobile: true,
            render: (row) => (
                <span className="text-slate-500 font-medium">
                    {row.fecha_inicio}
                </span>
            )
        },
        {
            header: 'Fecha Fin',
            accessor: 'fecha_fin',
            hiddenMobile: true,
            render: (row) => (
                <span className="text-slate-500 font-medium">
                    {row.fecha_fin}
                </span>
            )
        },
        {
            header: 'Estado',
            accessor: 'activa',
            hiddenMobile: true,
            render: (row) => (
                <span
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${row.activa
                            ? 'bg-green-50 text-green-600 border-green-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                >
                    {row.activa ? 'Activa' : 'Inactiva'}
                </span>
            )
        }
    ];

    const actions = (row) => (
        <div className="flex items-center gap-1">
            <button
                onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                title="Editar"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <BasePanel titulo="Gestión de Temporadas" backUrl="/panel/admin">
            <Card title="Temporadas">
                <div className="flex justify-end mb-6">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nueva Temporada
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 italic font-medium animate-pulse">
                        Cargando temporadas...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={temporadas}
                        actions={actions}
                        onRowClick={handleRowClick}
                    />
                )}
            </Card>

            {/* Modal Formulario */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTemporada ? "Editar Temporada" : "Nueva Temporada"}
            >
                <TemporadaForm
                    temporada={editingTemporada}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchTemporadas();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Modal de Detalle (Mictlán Adaptive) */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detalles de Temporada"
            >
                {selectedTemporada && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Información General</h3>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nombre de edición</p>
                                    <p className="text-xl font-black text-slate-800">{selectedTemporada.nombre}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inicio</p>
                                        <p className="font-bold text-slate-700">{selectedTemporada.fecha_inicio}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fin</p>
                                        <p className="font-bold text-slate-700">{selectedTemporada.fecha_fin}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus actual</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${selectedTemporada.activa
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {selectedTemporada.activa ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedTemporada); }}
                                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-premium"
                            >
                                Editar Información
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </BasePanel>
    );
}
