import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import SearchBar from '../../../../Components/UI/SearchBar';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import CanchaForm from './CanchaForm';
import { Plus, Edit, Trash2, MapPin, Map, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CanchasContent() {
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCancha, setEditingCancha] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCanchas = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/canchas');
            setCanchas(response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de canchas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCanchas();
    }, []);

    const filteredCanchas = canchas.filter(cancha =>
        cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cancha.direccion && cancha.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreate = () => {
        setEditingCancha(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cancha) => {
        setEditingCancha(cancha);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta sede? Se perderán configuraciones asociadas.')) return;
        try {
            await http.delete(`/api/canchas/${id}`);
            toast.success('Sede oficial eliminada');
            fetchCanchas();
        } catch (error) {
            toast.error('Error al eliminar sede');
        }
    };

    const columns = [
        {
            header: 'Sede/Complejo',
            accessor: 'nombre',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {row.imagen_url ? (
                        <img
                            src={row.imagen_url}
                            alt={row.nombre}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--color-border-subtle)' }}
                        />
                    ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            <MapPin size={20} />
                        </div>
                    )}
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--color-navy)' }}>
                        {row.nombre}
                    </span>
                </div>
            )
        },
        {
            header: 'Dirección o Referencia',
            accessor: 'direccion',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                    <Map size={14} style={{ color: 'var(--color-slate-light)' }} />
                    {row.direccion || <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No especificada</span>}
                </div>
            )
        },
        {
            header: 'Horarios Configurados',
            accessor: 'horarios',
            render: (row) => (
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {row.horarios?.length || 0} periodo(s)
                </span>
            )
        },
        {
            header: 'Estado',
            accessor: 'activa',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {row.activa ? (
                        <span style={{ color: 'var(--color-sage)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}><CheckCircle2 size={14} /> Activa</span>
                    ) : (
                        <span style={{ color: 'var(--color-terra)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}><XCircle size={14} /> Inactiva</span>
                    )}
                </div>
            )
        }
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button
                onClick={() => handleEdit(row)}
                className="btn-ghost"
                style={{ padding: '6px', color: 'var(--color-slate)', borderRadius: '4px' }}
                title="Configurar Sede"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => handleDelete(row.id)}
                className="btn-ghost"
                style={{ padding: '6px', color: 'var(--color-terra)', borderRadius: '4px' }}
                title="Eliminar Sede"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <>
            <Card title="Directorio Oficial de Canchas y Sedes">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar por nombre o calle..."
                        width="280px"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus} variant="primary">
                        Declarar Nueva Sede
                    </GradientButton>
                </div>
                <br />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Cargando catálogo de canchas...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredCanchas}
                        actions={actions}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCancha ? "Configuración de Sede" : "Alta de Nueva Sede"}
            >
                <CanchaForm
                    cancha={editingCancha}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchCanchas();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
}
