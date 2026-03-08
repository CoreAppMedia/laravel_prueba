import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import EquipoForm from './EquipoForm';
import { Plus, Edit, Trash2, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquiposIndex() {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipo, setEditingEquipo] = useState(null);

    const fetchEquipos = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/equipos');
            setEquipos(response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de equipos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

    const handleCreate = () => {
        setEditingEquipo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (equipo) => {
        setEditingEquipo(equipo);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este equipo?')) return;

        try {
            await http.delete(`/api/equipos/${id}`);
            toast.success('Equipo eliminado correctamente');
            fetchEquipos();
        } catch (error) {
            toast.error('Error al eliminar el equipo');
        }
    };

    const columns = [
        {
            header: 'Equipo',
            accessor: 'nombre_mostrado',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-mx-green">{row.nombre_mostrado}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Users size={10} />
                        {row.club?.nombre || 'Independiente'}
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            accessor: 'categoria',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400" />
                    <span className="text-slate-300">{row.categoria?.nombre || 'Sin categoría'}</span>
                </div>
            )
        },
        {
            header: 'Estatus',
            accessor: 'activo',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${row.activo ? 'bg-mx-green/20 text-green-400 border border-green-500/30' : 'bg-red-900/40 text-red-400 border border-red-500/30'}`}>
                    {row.activo ? 'Activo' : 'Baja'}
                </span>
            )
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
        <BasePanel titulo="Gestión de Equipos" backUrl="/panel/admin">
            <Card title="Plantilla de Equipos Registrados">
                <div className="flex justify-end mb-4">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Nuevo Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400 italic">Cargando equipos...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={equipos}
                        actions={actions}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEquipo ? "Configurar Equipo" : "Registro de Equipo"}
            >
                <EquipoForm
                    equipo={editingEquipo}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchEquipos();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </BasePanel>
    );
}
