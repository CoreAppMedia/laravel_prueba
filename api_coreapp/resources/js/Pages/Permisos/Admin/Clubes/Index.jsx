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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                    {row.es_club ? (
                        <ShieldCheck size={16} style={{ color: 'var(--color-slate)' }} />
                    ) : (
                        <User size={16} style={{ color: 'var(--color-gold)' }} />
                    )}
                    <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        {row.es_club ? 'Club' : 'Independiente'}
                    </span>
                </div>
            )
        },
        { 
            header: 'Nombre', 
            accessor: 'nombre',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {row.nombre}
                </span>
            )
        },
        { header: 'Teléfono', accessor: 'telefono' },
        { header: 'Correo', accessor: 'correo' },
        {
            header: 'Estado',
            accessor: 'activo',
            render: (row) => (
                <span 
                    style={{ 
                        display: 'inline-flex',
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        backgroundColor: row.activo ? 'var(--color-sage-light)' : 'var(--color-terra-light)',
                        color: row.activo ? 'var(--color-sage)' : 'var(--color-terra)',
                        border: `1px solid ${row.activo ? 'rgba(58, 107, 82, 0.15)' : 'rgba(192, 68, 42, 0.15)'}`
                    }}
                >
                    {row.activo ? 'Activo' : 'Suspendido'}
                </span>
            )
        }
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                onClick={() => handleEdit(row)} 
                className="btn-ghost"
                style={{ 
                    padding: '6px', 
                    color: 'var(--color-slate)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                }} 
                title="Editar"
            >
                <Edit size={18} />
            </button>
            <button 
                onClick={() => handleDelete(row.id)} 
                className="btn-ghost"
                style={{ 
                    padding: '6px', 
                    color: 'var(--color-terra)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                }} 
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <BasePanel titulo="Gestión de Clubes y Equipos Independientes" backUrl="/panel/admin">
            <Card title="Directorio de Clubes">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <GradientButton onClick={handleCreate} icon={Plus} variant="primary">
                        Registrar Club / Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                        Cargando clubes...
                    </div>
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
                title={editingClub ? "Editar Información" : "Registro de Nuevo Club"}
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
