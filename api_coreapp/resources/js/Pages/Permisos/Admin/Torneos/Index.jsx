import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import TorneoForm from './TorneoForm';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Trophy, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TorneosIndex() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingTorneo, setEditingTorneo] = useState(null);
    const [selectedTorneo, setSelectedTorneo] = useState(null);

    const fetchTorneos = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/torneos');
            setTorneos(response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de torneos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTorneos();
    }, []);

    const handleCreate = () => {
        setEditingTorneo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (torneo) => {
        setEditingTorneo(torneo);
        setIsModalOpen(true);
    };

    const handleRowClick = (torneo) => {
        setSelectedTorneo(torneo);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este torneo?')) return;

        try {
            await http.delete(`/api/torneos/${id}`);
            toast.success('Torneo eliminado correctamente');
            fetchTorneos();
        } catch (error) {
            toast.error('Error al eliminar el torneo');
        }
    };

    const columns = [
        {
            header: 'Torneo',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">{row.nombre}</span>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Trophy size={10} className="text-orange-400" />
                            {row.tipo?.nombre || 'General'}
                        </span>
                        <span className="md:hidden text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            {row.estatus}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Temporada',
            accessor: 'temporada',
            hiddenMobile: true,
            render: (row) => (
                <span className="font-black text-[13px] text-green-600 uppercase tracking-tight">
                    {row.temporada?.nombre || 'N/A'}
                </span>
            )
        },
        {
            header: 'Periodo',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar size={13} className="text-slate-300" />
                    <span>{row.fecha_inicio} <span className="text-slate-300 mx-1">/</span> {row.fecha_fin}</span>
                </div>
            )
        },
        {
            header: 'Estatus',
            accessor: 'estatus',
            hiddenMobile: true,
            render: (row) => {
                const styles = {
                    'En Inscripción': 'bg-green-50 text-green-600 border-green-100',
                    'En Curso': 'bg-orange-50 text-orange-600 border-orange-100',
                    'Finalizado': 'bg-slate-50 text-slate-400 border-slate-200',
                    'Planeación': 'bg-blue-50 text-blue-600 border-blue-100'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.estatus] || styles['Planeación']}`}>
                        {row.estatus}
                    </span>
                );
            }
        }
    ];

    const actions = (row) => (
        <div className="flex items-center gap-3">
            <Link
                to={`/panel/admin/torneos/${row.id}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-gray-500 uppercase tracking-widest hover:bg-slate-900 transition-all shadow-sm"
            >
                Entrar
                <ArrowRight size={12} />
            </Link>
            <div className="flex items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <BasePanel titulo="Gestión de Torneos" backUrl="/panel/admin">
            <Card title="Torneos">
                <div className="flex justify-end mb-6">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nuevo Torneo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse font-bold italic">
                        Cargando registros...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={torneos}
                        actions={actions}
                        onRowClick={handleRowClick}
                    />
                )}
            </Card>

            {/* Modal Formulario */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTorneo ? "Configurar Torneo" : "Nuevo Torneo"}
            >
                <TorneoForm
                    torneo={editingTorneo}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchTorneos();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Modal Detalle (Mictlán Adaptive) */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detalles del Torneo"
            >
                {selectedTorneo && (

                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Nombre oficial</p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedTorneo.nombre}</h3>
                                </div>
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <Trophy size={24} className="text-orange-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Edición</p>
                                    <p className="font-black text-green-600 uppercase tracking-tight">{selectedTorneo.temporada?.nombre || 'General'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fecha Inicio</p>
                                        <p className="font-bold text-slate-700">{selectedTorneo.fecha_inicio}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fecha Fin</p>
                                        <p className="font-bold text-slate-700">{selectedTorneo.fecha_fin}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Estado del torneo</p>
                                    <span className="font-black text-blue-600 uppercase tracking-widest text-[11px]">{selectedTorneo.estatus}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to={`/panel/admin/torneos/${selectedTorneo.id}`}
                                className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-900 transition-all shadow-premium"
                            >
                                Gestionar
                            </Link>
                            <button
                                onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedTorneo); }}
                                className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </BasePanel>
    );
}
