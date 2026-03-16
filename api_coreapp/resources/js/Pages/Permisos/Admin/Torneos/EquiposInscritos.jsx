import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import { Plus, Check, X, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquiposInscritos({ torneo }) {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState('');
    const [pagadoInscripcion, setPagadoInscripcion] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchEquiposInscritos = async () => {
        setLoading(true);
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/equipos-inscritos`);
            setEquipos(response.data);
        } catch (error) {
            toast.error('Error al cargar equipos inscritos');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquiposDisponibles = async () => {
        try {
            const response = await http.get('/api/equipos');
            // Filter out teams that don't match the tournament category visually (although API will validate it)
            // Or just load them all and let the user see visually if they match
            setEquiposDisponibles(response.data);
        } catch (error) {
            toast.error('Error al cargar equipos disponibles');
        }
    };

    useEffect(() => {
        fetchEquiposInscritos();
        fetchEquiposDisponibles();
    }, [torneo.id]);

    const handleInscriptionSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/torneos/${torneo.id}/inscribir`, {
                equipo_id: selectedEquipoId,
                pagado_inscripcion: pagadoInscripcion
            });
            toast.success('Equipo inscrito con éxito');
            setIsModalOpen(false);
            setSelectedEquipoId('');
            setPagadoInscripcion(false);
            fetchEquiposInscritos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al inscribir el equipo');
        } finally {
            setSaving(false);
        }
    };

    const togglePago = async (equipoId, currentStatus) => {
        try {
            await http.patch(`/api/torneos/${torneo.id}/equipos/${equipoId}/pago`, {
                pagado_inscripcion: !currentStatus
            });
            toast.success('Estatus de pago actualizado');
            fetchEquiposInscritos();
        } catch (error) {
            toast.error('Error al actualizar pago');
        }
    };

    const columns = [
        {
            header: 'Equipo Participante',
            accessor: 'nombre_mostrado',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-gold)' }}>
                        <Users size={16} style={{ margin: 'auto' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-slate)', fontSize: '14px', fontFamily: 'var(--font-display)' }}>{row.nombre_mostrado}</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Shield size={10} />
                            {row.club?.nombre || 'Independiente'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            render: (row) => {
                const isCompatible = torneo.categoria_id === row.categoria_id;
                return (
                    <span 
                        style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '4px 10px', 
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isCompatible ? 'var(--color-sage-light)' : 'var(--color-terra-light)',
                            color: isCompatible ? 'var(--color-sage)' : 'var(--color-terra)',
                            border: `1px solid ${isCompatible ? 'rgba(58, 107, 82, 0.1)' : 'rgba(192, 68, 42, 0.1)'}`
                        }}
                    >
                        {row.categoria?.nombre || 'General'}
                        {!isCompatible && ' (Incompatible)'}
                    </span>
                );
            }
        },
        {
            header: 'Fecha de Alta',
            render: (row) => (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    {new Date(row.pivot.fecha_inscripcion).toLocaleDateString()}
                </span>
            )
        },
        {
            header: 'Estado de Pago',
            render: (row) => {
                const isPaid = row.pivot.pagado_inscripcion;
                return (
                    <button 
                        onClick={() => togglePago(row.id, isPaid)}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            backgroundColor: isPaid ? 'var(--color-sage-light)' : 'var(--color-gold-light)',
                            color: isPaid ? 'var(--color-sage)' : 'var(--color-gold)',
                            border: `1px solid ${isPaid ? 'rgba(58, 107, 82, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`,
                            outline: 'none'
                        }}
                        title="Haz clic para actualizar estatus de pago"
                    >
                        {isPaid ? <Check size={14} /> : <X size={14} />}
                        {isPaid ? 'Liquidado' : 'Pendiente'}
                    </button>
                );
            }
        }
    ];

    // Filter out teams that are already inscribed to avoiding showing them in the dropdown
    const equiposFiltrados = equiposDisponibles.filter(
        ed => !equipos.some(ei => ei.id === ed.id)
    );

    const equiposInscritosFiltrados = equipos.filter((equipo) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;

        const byNombre = equipo.nombre_mostrado?.toLowerCase().includes(q);
        const byClub = equipo.club?.nombre?.toLowerCase().includes(q);
        const byCategoria = equipo.categoria?.nombre?.toLowerCase().includes(q);

        return Boolean(byNombre || byClub || byCategoria);
    });

    const inputStyle = {
        width: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: 'var(--color-text-primary)',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxShadow: 'var(--shadow-soft)',
    };

    return (
        <Card title="Plantilla de Equipos Oficiales">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar equipo (nombre, club o categoría)..."
                    width="280px"
                />
                <GradientButton 
                    onClick={() => setIsModalOpen(true)} 
                    icon={Plus}
                    variant="primary"
                >
                    Inscribir Nuevo Equipo
                </GradientButton>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>Cargando equipos...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={equiposInscritosFiltrados}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Inscripción a Torneo"
            >
                <form onSubmit={handleInscriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {torneo.categoria && (
                        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface-alt)', borderLeft: '4px solid var(--color-sage)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            <span style={{ fontWeight: 800, color: 'var(--color-sage)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>Restricción de Categoría</span>
                            Torneo exclusivo para la categoría: <strong style={{ color: 'var(--color-slate)' }}>{torneo.categoria.nombre}</strong>. Solo se permiten registros de equipos compatibles.
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ marginLeft: '4px' }}>Seleccionar Equipo para Alta</label>
                        <select 
                            style={inputStyle}
                            value={selectedEquipoId}
                            onChange={(e) => setSelectedEquipoId(e.target.value)}
                            required
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-gold)';
                                e.target.style.boxShadow = '0 0 0 4px var(--color-gold-light)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--color-border-subtle)';
                                e.target.style.boxShadow = 'var(--shadow-soft)';
                            }}
                        >
                            <option value="">-- Elige un equipo de la lista --</option>
                            {equiposFiltrados.map(eq => {
                                const isCompatible = !torneo.categoria_id || eq.categoria_id === torneo.categoria_id;
                                return (
                                    <option key={eq.id} value={eq.id} disabled={!isCompatible}>
                                        {eq.nombre_mostrado} {eq.categoria ? `[${eq.categoria.nombre}]` : ''} {!isCompatible ? ' (Categoría No Válida)' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '12px 16px', 
                            background: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-md)', 
                            border: '1px solid var(--color-border-subtle)',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPagadoInscripcion(!pagadoInscripcion)}
                    >
                        <input 
                            type="checkbox" 
                            id="pagado_inscripcion"
                            checked={pagadoInscripcion}
                            onChange={(e) => setPagadoInscripcion(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--color-sage)', cursor: 'pointer' }}
                        />
                        <label htmlFor="pagado_inscripcion" style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                            Registrar con pago de inscripción liquidado
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn btn-ghost"
                            style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton
                            type="submit"
                            disabled={saving || !selectedEquipoId}
                            isLoading={saving}
                            variant="primary"
                        >
                            Finalizar Inscripción
                        </GradientButton>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
