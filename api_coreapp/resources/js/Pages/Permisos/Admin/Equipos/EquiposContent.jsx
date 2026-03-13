import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import EquipoForm from './EquipoForm';
import { Plus, Edit, Trash2, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquiposContent() {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipo, setEditingEquipo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filtrar equipos según el término de búsqueda
    const filteredEquipos = equipos.filter(equipo =>
        equipo.nombre_mostrado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.club?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--color-sage)' }}>
                        {row.nombre_mostrado}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <Users size={12} style={{ color: 'var(--color-gold)' }} />
                        {row.club?.nombre || 'Independiente'}
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            accessor: 'categoria',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <Star size={14} style={{ color: 'var(--color-gold)' }} />
                    <span style={{ fontWeight: 600 }}>{row.categoria?.nombre || 'General'}</span>
                </div>
            )
        },
        {
            header: 'Sede Oficial',
            accessor: 'cancha_id',
            render: (row) => {
                const diaMap = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom' };
                const diaText = row.cancha_horario?.dia_semana ? diaMap[row.cancha_horario.dia_semana] : '-';
                const horaText = row.cancha_horario?.hora ? row.cancha_horario.hora.substring(0, 5) : '-';

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                            {row.cancha?.nombre || 'Sin definir'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            {row.cancha_horario ? `${diaText} ${horaText} hrs` : '-'}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Estatus',
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
                    {row.activo ? 'Activo' : 'Baja'}
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
            <Card title="Plantilla de Equipos Registrados">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar equipos..."
                        width="280px"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus} variant="primary">
                        Registrar Nuevo Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                        Cargando equipos...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredEquipos}
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
        </>
    );
}
