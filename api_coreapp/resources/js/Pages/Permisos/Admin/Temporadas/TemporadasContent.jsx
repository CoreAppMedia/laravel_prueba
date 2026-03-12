import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import TemporadaForm from './TemporadaForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TemporadasContent() {
    const [temporadas, setTemporadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemporada, setEditingTemporada] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filtrar temporadas según el término de búsqueda
    const filteredTemporadas = temporadas.filter(temporada =>
        temporada.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temporada.fecha_inicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temporada.fecha_fin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        { 
            header: 'Nombre de Edición', 
            accessor: 'nombre',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--color-slate)' }}>
                    {row.nombre}
                </span>
            )
        },
        { 
            header: 'Fecha Inicio', 
            accessor: 'fecha_inicio',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {row.fecha_inicio}
                </span>
            )
        },
        { 
            header: 'Fecha Fin', 
            accessor: 'fecha_fin',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {row.fecha_fin}
                </span>
            )
        },
        {
            header: 'Estado',
            accessor: 'activa',
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
                        backgroundColor: row.activa ? 'var(--color-sage-light)' : 'var(--color-bg-surface-alt)',
                        color: row.activa ? 'var(--color-sage)' : 'var(--color-text-muted)',
                        border: `1px solid ${row.activa ? 'rgba(58, 107, 82, 0.15)' : 'var(--color-border-subtle)'}`
                    }}
                >
                    {row.activa ? 'Activa' : 'Inactiva'}
                </span>
            )
        }
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                onClick={() => handleEdit(row)} 
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
        <>
            <Card title="Listado de Temporadas">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar temporadas..."
                        width="280px"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus} variant="primary">
                        Nueva Temporada
                    </GradientButton>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                        Cargando temporadas...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredTemporadas}
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
        </>
    );
}
