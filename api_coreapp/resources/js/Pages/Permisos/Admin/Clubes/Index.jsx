import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import ClubForm from './ClubForm';
import { Plus, Edit, Trash2, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClubesIndex() {
    const [clubes, setClubes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);

    const fetchClubes = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/clubs');
            setClubes(response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de clubes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubes();
    }, []);

    const handleCreate = () => {
        setEditingClub(null);
        setIsModalOpen(true);
    };

    const handleEdit = (club) => {
        setEditingClub(club);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este club? Se perderá el historial de sus equipos.')) return;

        try {
            await http.delete(`/api/clubs/${id}`);
            toast.success('Club eliminado correctamente');
            fetchClubes();
        } catch (error) {
            toast.error('Error al eliminar el club');
        }
    };

    const columns = [
        {
            header: 'Tipo',
            accessor: 'es_club',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.es_club ? (
                        <ShieldCheck size={16} className="text-blue-400" />
                    ) : (
                        <User size={16} className="text-orange-400" />
                    )}
                    <span>{row.es_club ? 'Club' : 'Independiente'}</span>
                </div>
            )
        },
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Teléfono', accessor: 'telefono' },
        { header: 'Correo', accessor: 'correo' },
        {
            header: 'Estado',
            accessor: 'activo',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.activo ? 'bg-mx-green/20 text-green-400 border border-green-500/30' : 'bg-red-400/20 text-red-400 border border-red-500/30'}`}>
                    {row.activo ? 'Activo' : 'Suspendido'}
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
        <BasePanel titulo="Gestión de Clubes y Equipos Independientes" backUrl="/panel/admin">
            <Card title="Directorio de Clubes">
                <div className="flex justify-end mb-4">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Club / Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400 italic">Cargando clubes...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={clubes}
                        actions={actions}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingClub ? "Editar Información del Club" : "Registro de Nuevo Club"}
            >
                <ClubForm
                    club={editingClub}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchClubes();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </BasePanel>
    );
}
