import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import TorneoForm from './TorneoForm';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Trophy, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TorneosContent() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingTorneo, setEditingTorneo] = useState(null);
    const [selectedTorneo, setSelectedTorneo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const diaSemanaMap = {
        1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue',
        5: 'Vie', 6: 'Sáb', 7: 'Dom'
    };

    const fetchTorneos = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/torneos');
            setTorneos(response.data?.data || response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de torneos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTorneos();
    }, []);

    const filteredTorneos = torneos.filter(torneo =>
        torneo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        torneo.temporada?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        torneo.tipo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setEditingTorneo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (torneo) => {
        setEditingTorneo(torneo);
        setIsModalOpen(true);
    };

    const handleRowClick = (torneo) => {
        setSelectedTorneo(torneo);
        setIsDetailModalOpen(true);
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
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">{row.nombre}</span>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Trophy size={10} className="text-orange-400" />
                            {row.tipo?.nombre || 'General'}
                        </span>
                        <span className="md:hidden text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            {row.estatus}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Temporada',
            accessor: 'temporada',
            hiddenMobile: true,
            render: (row) => (
                <span className="font-black text-[13px] text-green-600 uppercase tracking-tight">
                    {row.temporada?.nombre || 'N/A'}
                </span>
            )
        },
        {
            header: 'Periodo',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar size={13} className="text-slate-300" />
                    <span>{row.fecha_inicio?.split('T')[0]} <span className="text-slate-300 mx-1">/</span> {row.fecha_fin?.split('T')[0]}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: 'estatus',
            hiddenMobile: true,
            render: (row) => {

                const styles = {
                    'En Inscripción': 'bg-green-50 text-green-600 border-green-100',
                    'En Curso': 'bg-orange-50 text-orange-600 border-orange-100',
                    'Finalizado': 'bg-slate-50 text-slate-400 border-slate-200',
                    'Planeación': 'bg-blue-50 text-blue-600 border-blue-100'
                };
                return (
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[row.estatus] || styles['Planeación']}`}>
                            {row.estatus}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Días',
            accessor: 'dias_juego',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex gap-1 flex-wrap">
                    {row.dias_juego && row.dias_juego.length > 0 ? (
                        row.dias_juego.map(diaId => (
                            <span
                                key={diaId}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 text-slate-600 font-black border border-orange-100"
                            >
                                {diaSemanaMap[diaId]}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-400 italic font-bold">Toda la semana</span>
                    )}
                </div>
            )
        }
    ];

    const actions = (row) => (
        <div className="flex items-center gap-3">
            <Link
                to={`/panel/admin/torneos/${row.id}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all shadow-sm"
            >
                Entrar
                <ArrowRight size={12} />
            </Link>
            <div className="flex items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                        Mis Torneos
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '15px' }}>
                        Gestiona los torneos activos o crea una nueva competencia.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar torneos..."
                        className="w-full md:w-64 shadow-sm"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nuevo Torneo
                    </GradientButton>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gold-light)', borderTopColor: 'var(--color-gold)', borderRadius: '50%' }}></div>
                </div>
            ) : filteredTorneos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border-strong)' }}>
                    <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-secondary)' }}>No hay torneos registrados</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '8px' }}>Crea el primer torneo para comenzar.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredTorneos.map(torneo => (
                        <div key={torneo.id} style={{
                            background: 'var(--color-bg-surface)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '24px',
                            position: 'relative',
                            boxShadow: 'var(--shadow-soft)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }} className="hover:-translate-y-1 hover:shadow-premium group">
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{
                                    backgroundColor: torneo.estatus === 'En Curso' ? 'var(--color-sage-light)' : 'var(--color-bg-surface-alt)',
                                    color: torneo.estatus === 'En Curso' ? 'var(--color-sage)' : 'var(--color-text-muted)',
                                    padding: '6px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    border: '1px solid var(--color-border-subtle)'
                                }}>
                                    {torneo.estatus}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button onClick={(e) => { e.preventDefault(); handleEdit(torneo); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={(e) => { e.preventDefault(); handleDelete(torneo.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, marginBottom: '24px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-terra)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                                    {torneo.temporada?.nombre || 'General'}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: '16px' }}>
                                    {torneo.nombre}
                                </h3>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                                        <Trophy size={14} className="text-orange-400" />
                                        <span className="truncate">{torneo.tipo?.nombre || 'General'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                                        <Calendar size={14} className="text-slate-400" />
                                        <span className="truncate">{torneo.fecha_inicio?.split('T')[0] || 'Por definir'}</span>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                to={`/panel/admin/torneos/${torneo.id}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: 'var(--color-slate)',
                                    color: 'white',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    width: '100%'
                                }}
                                className="hover:bg-[#2A394E] shadow-sm hover:shadow-md"
                            >
                                Entrar al Torneo
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

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
        </div>
    );
}
