import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { Plus, Edit, Trash2, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ArbitrosContent({ torneo = null }) {
    const [arbitros, setArbitros] = useState([]);
    const [globalArbitros, setGlobalArbitros] = useState([]); // Master catalog for assignment
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [editingArbitro, setEditingArbitro] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        activo: true
    });

    const fetchArbitros = async () => {
        setLoading(true);
        try {
            const url = torneo ? `/api/torneos/${torneo.id}/arbitros` : '/api/arbitros';
            const response = await http.get(url);
            setArbitros(response.data);
            
            // If in tournament mode, also load the master catalog for assignment
            if (torneo) {
                const globalRes = await http.get('/api/arbitros');
                // Filter only active ones and those NOT already in the tournament
                const alreadyAssignedIds = response.data.map(a => a.id);
                setGlobalArbitros(globalRes.data.filter(a => a.activo && !alreadyAssignedIds.includes(a.id)));
            }
        } catch (error) {
            toast.error('Error al cargar la lista de árbitros');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArbitros();
    }, [torneo?.id]);

    const handleCreate = () => {
        if (torneo) {
            setIsAssignmentModalOpen(true);
        } else {
            setEditingArbitro(null);
            setFormData({ nombre: '', telefono: '', activo: true });
            setErrors({});
            setIsModalOpen(true);
        }
    };

    const handleEdit = (arbitro) => {
        if (torneo) return; // Edit not allowed from tournament view, go to master catalog
        setEditingArbitro(arbitro);
        setFormData({
            nombre: arbitro.nombre,
            telefono: arbitro.telefono || '',
            activo: arbitro.activo
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const msg = torneo 
            ? '¿Seguro que deseas remover este árbitro del torneo? (Seguirá existiendo en el catálogo general)' 
            : '¿Seguro que deseas eliminar este árbitro permanentemente?';
        
        if (!window.confirm(msg)) return;

        try {
            if (torneo) {
                await http.delete(`/api/torneos/${torneo.id}/arbitros/${id}`);
                toast.success('Árbitro removido del torneo');
            } else {
                await http.delete(`/api/arbitros/${id}`);
                toast.success('Árbitro eliminado del catálogo');
            }
            fetchArbitros();
        } catch (error) {
            toast.error('Error al procesar la solicitud');
        }
    };

    const handleAssign = async (arbitroId) => {
        setSaving(true);
        try {
            await http.post(`/api/torneos/${torneo.id}/arbitros`, { arbitro_id: arbitroId });
            toast.success('Árbitro asignado al torneo');
            setIsAssignmentModalOpen(false);
            fetchArbitros();
        } catch (error) {
            toast.error('Error al asignar árbitro');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            if (editingArbitro) {
                await http.put(`/api/arbitros/${editingArbitro.id}`, formData);
                toast.success('Árbitro actualizado correctamente');
            } else {
                await http.post('/api/arbitros', formData);
                toast.success('Árbitro registrado correctamente');
            }
            setIsModalOpen(false);
            fetchArbitros();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Error al guardar el árbitro');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const columns = [
        {
            header: 'Nombre',
            accessor: 'nombre',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-bg-surface-alt)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid var(--color-border-subtle)'
                    }}>
                        <User size={16} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Teléfono',
            accessor: 'telefono',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                    <Phone size={14} style={{ opacity: 0.5 }} />
                    {row.telefono || 'Sin teléfono'}
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: 'activo',
            render: (row) => (
                <span className={`status-pill ${row.activo ? 'active' : 'finished'}`} style={{ fontSize: '10px' }}>
                    <span className="status-dot" />
                    {row.activo ? 'Activo' : 'Inactivo'}
                </span>
            )
        }
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!torneo && (
                <button
                    onClick={() => handleEdit(row)}
                    className="btn btn-ghost"
                    style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                    title="Editar"
                >
                    <Edit size={16} />
                </button>
            )}
            <button
                onClick={() => handleDelete(row.id)}
                className="btn btn-ghost"
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
                title={torneo ? "Remover del Torneo" : "Eliminar"}
            >
                {torneo ? <XCircle size={16} /> : <Trash2 size={16} />}
            </button>
        </div>
    );

    const inputStyle = {
        width: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--color-text-primary)',
        outline: 'none',
        transition: 'all 0.2s ease',
    };

    return (
        <Card title={torneo ? `Cuerpo Arbitral del Torneo` : `Catálogo Maestro de Árbitros`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '60%' }}>
                    {torneo 
                        ? 'Selecciona árbitros del catálogo general para que puedan ser asignados a los encuentros de este torneo.' 
                        : 'Administra la lista oficial de árbitros disponibles para todos los torneos.'}
                </p>
                <GradientButton onClick={handleCreate} icon={Plus}>
                    {torneo ? 'Asignar Árbitro' : 'Registrar Árbitro'}
                </GradientButton>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Cargando información...
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={arbitros}
                    actions={actions}
                />
            )}

            {/* Modal: Registro Global */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingArbitro ? 'Editar Árbitro' : 'Registrar Nuevo Árbitro'}
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                borderColor: errors.nombre ? 'var(--color-danger)' : 'var(--color-border-subtle)'
                            }}
                            required
                            placeholder="Ej. Juan Pérez"
                        />
                        {errors.nombre && <p style={{ color: 'var(--color-danger)', fontSize: '11px', fontWeight: 600, marginLeft: '4px' }}>{errors.nombre[0]}</p>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Teléfono de Contacto</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono} 
                            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                            style={inputStyle}
                            placeholder="Ej. 3312345678"
                        />
                    </div>

                    <div 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '12px 16px', 
                            background: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-md)', 
                            border: '1px solid var(--color-border-subtle)',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleChange({ target: { name: 'activo', type: 'checkbox', checked: !formData.activo } })}
                    >
                        <input
                            type="checkbox"
                            className="checkbox-premium"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--color-terra)', cursor: 'pointer' }}
                        />
                        <label style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                            Árbitro en activo para programar partidos
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                        <GradientButton type="submit" isLoading={saving} variant="primary">
                            {editingArbitro ? 'Actualizar Árbitro' : 'Registrar Árbitro'}
                        </GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal: Asignación a Torneo */}
            <Modal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                title="Asignar Árbitro al Torneo"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        Lista de árbitros activos registrados en el catálogo general:
                    </p>
                    {globalArbitros.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border-subtle)' }}>
                            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No hay árbitros disponibles para asignar o ya todos están inscritos.</p>
                            <Link to="/panel/admin" style={{ color: 'var(--color-gold)', fontSize: '13px', fontWeight: 700, marginTop: '10px', display: 'inline-block' }}>Ir al Panel Admin para registrar nuevos</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHieght: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                            {globalArbitros.map(arb => (
                                <div key={arb.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} style={{ color: 'var(--color-gold)' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '14px' }}>{arb.nombre}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{arb.telefono || 'Sin teléfono'}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAssign(arb.id)}
                                        disabled={saving}
                                        style={{ padding: '6px 14px', borderRadius: '6px', background: 'var(--color-gold)', color: 'white', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                                    >
                                        Asignar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button onClick={() => setIsAssignmentModalOpen(false)} className="btn btn-ghost">Cerrar</button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
}
