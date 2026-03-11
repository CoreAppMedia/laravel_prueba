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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--color-slate)' }}>{row.nombre}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Trophy size={12} style={{ color: 'var(--color-gold)' }} />
                        {row.tipo?.nombre || 'General'}
                    </span>
                </div>
            )
        },
        {
            header: 'Temporada',
            accessor: 'temporada',
            render: (row) => (
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: 'var(--color-sage)' }}>
                    {row.temporada?.nombre || 'N/A'}
                </span>
            )
        },
        {
            header: 'Periodo de Juego',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                    <Calendar size={13} style={{ color: 'var(--color-gold)' }} />
                    <span style={{ fontWeight: 500 }}>{row.fecha_inicio} <span style={{ color: 'var(--color-text-muted)', margin: '0 4px' }}>al</span> {row.fecha_fin}</span>
                </div>
            )
        },
        {
            header: 'Estatus',
            accessor: 'estatus',
            render: (row) => {
                const styles = {
                    'Planeación': { bg: 'var(--color-bg-surface-alt)', color: 'var(--color-text-muted)', border: 'var(--color-border-subtle)' },
                    'En Inscripción': { bg: 'var(--color-sage-light)', color: 'var(--color-sage)', border: 'rgba(58, 107, 82, 0.15)' },
                    'En Curso': { bg: 'var(--color-gold-light)', color: 'var(--color-gold)', border: 'rgba(212, 175, 55, 0.15)' },
                    'Finalizado': { bg: 'var(--color-terra-light)', color: 'var(--color-terra)', border: 'rgba(192, 68, 42, 0.15)' }
                };
                const style = styles[row.estatus] || styles['Planeación'];
                return (
                    <span 
                        style={{ 
                            display: 'inline-flex',
                            padding: '4px 10px', 
                            borderRadius: 'var(--radius-sm)', 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            backgroundColor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`
                        }}
                    >
                        {row.estatus}
                    </span>
                );
            }
        }
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
                to={`/panel/admin/torneos/${row.id}`} 
                className="btn-ghost"
                style={{ 
                    padding: '6px 12px', 
                    color: 'var(--color-sage)',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-sage-light)',
                    border: '1px solid rgba(58, 107, 82, 0.1)'
                }}
            >
                Gestionar
                <ArrowRight size={14} />
            </Link>
            <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                    onClick={() => handleEdit(row)} 
                    className="btn-ghost"
                    style={{ padding: '6px', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: 'pointer' }} 
                    title="Editar Torneo"
                >
                    <Edit size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(row.id)} 
                    className="btn-ghost"
                    style={{ padding: '6px', color: 'var(--color-terra)', background: 'none', border: 'none', cursor: 'pointer' }} 
                    title="Eliminar Torneo"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <BasePanel titulo="Gestión de Torneos" backUrl="/panel/admin">
            <Card title="Calendario y Organización de Torneos">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <GradientButton onClick={handleCreate} icon={Plus} variant="primary">
                        Comenzar Nuevo Torneo
                    </GradientButton>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                        Cargando torneos...
                    </div>
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
