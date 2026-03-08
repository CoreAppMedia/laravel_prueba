import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import TorneoForm from './TorneoForm';
import { Plus, Edit, Trash2, Trophy, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TorneosIndex() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTorneo, setEditingTorneo] = useState(null);

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
                <div className="flex flex-col">
                    <span className="font-bold text-white">{row.nombre}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Trophy size={12} className="text-yellow-500" />
                        {row.tipo?.nombre || 'General'}
                    </span>
                </div>
            )
        },
        {
            header: 'Temporada',
            accessor: 'temporada',
            render: (row) => (
                <span className="text-blue-400 font-medium">{row.temporada?.nombre || 'N/A'}</span>
            )
        },
        {
            header: 'Periodo',
            render: (row) => (
                <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Calendar size={12} />
                    {row.fecha_inicio} al {row.fecha_fin}
                </div>
            )
        },
        {
            header: 'Estatus',
            accessor: 'estatus',
            render: (row) => {
                const styles = {
                    'Planeación': 'bg-slate-700 text-slate-300',
                    'En Inscripción': 'bg-blue-900/40 text-blue-400 border border-blue-500/30',
                    'En Curso': 'bg-mx-green/20 text-green-400 border border-green-500/30',
                    'Finalizado': 'bg-red-900/40 text-red-400 border border-red-500/30'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${styles[row.estatus] || styles['Planeación']}`}>
                        {row.estatus}
                    </span>
                );
            }
        }
    ];

    const actions = (row) => (
        <>
            <button onClick={() => handleEdit(row)} className="text-blue-400 hover:text-blue-300 p-1" title="Editar">
                <Edit size={18} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300 p-1" title="Eliminar">
                <Trash2 size={18} />
            </button>
        </>
    );

    return (
        <BasePanel titulo="Gestión de Torneos" backUrl="/panel/admin">
            <Card title="Calendario de Torneos Activos">
                <div className="flex justify-end mb-4">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nuevo Torneo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400 italic">Cargando torneos...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={torneos}
                        actions={actions}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTorneo ? "Configurar Torneo" : "Registro de Nuevo Torneo"}
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
        </BasePanel>
    );
}
