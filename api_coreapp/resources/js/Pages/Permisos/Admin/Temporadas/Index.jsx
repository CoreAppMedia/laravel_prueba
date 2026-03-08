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
    const [editingTemporada, setEditingTemporada] = useState(null);

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
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Fecha Inicio', accessor: 'fecha_inicio' },
        { header: 'Fecha Fin', accessor: 'fecha_fin' },
        {
            header: 'Estado',
            accessor: 'activa',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.activa ? 'bg-mx-green/20 text-green-400 border border-green-500/30' : 'bg-slate-700 text-slate-300'}`}>
                    {row.activa ? 'Activa' : 'Inactiva'}
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
        <BasePanel titulo="Gestión de Temporadas" backUrl="/panel/admin">
            <Card title="Listado de Temporadas">
                <div className="flex justify-end mb-4">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nueva Temporada
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400">Cargando datos...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={temporadas}
                        actions={actions}
                    />
                )}
            </Card>

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
        </BasePanel>
    );
}
