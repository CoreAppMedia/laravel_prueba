import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import DirectivoForm from './DirectivoForm';
import { Plus, Edit, Trash2, User, Phone, MapPin, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DirectivosContent() {
    const [directivos, setDirectivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingDirectivo, setEditingDirectivo] = useState(null);
    const [selectedDirectivo, setSelectedDirectivo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDirectivos = async () => {
        setLoading(true);
        try {
            const response = await http.get('/api/directivos');
            setDirectivos(response.data);
        } catch (error) {
            toast.error('Error al cargar la lista de directivos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectivos();
    }, []);

    const filteredDirectivos = directivos.filter(dir =>
        dir.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dir.correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dir.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dir.tipo?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setEditingDirectivo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (dir) => {
        setEditingDirectivo(dir);
        setIsModalOpen(true);
    };

    const handleRowClick = (dir) => {
        setSelectedDirectivo(dir);
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este directivo? Perderá la asociación con sus clubes/equipos.')) return;

        try {
            await http.delete(`/api/directivos/${id}`);
            toast.success('Directivo eliminado correctamente');
            fetchDirectivos();
        } catch (error) {
            toast.error('Error al eliminar el directivo');
        }
    };

    const columns = [
        {
            header: 'Nombre',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">
                        {row.nombre}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${row.tipo?.nombre === 'Dueño Club' ? 'text-blue-500' : 'text-purple-500'}`}>
                            {row.tipo?.nombre || 'General'}
                        </span>
                        <div className="md:hidden">
                            {!row.activo && <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contacto',
            accessor: 'telefono',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-[13px] text-slate-500">{row.telefono || '-'}</span>
                    <span className="text-[11px] text-slate-400">{row.correo_electronico || '-'}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: 'activo',
            hiddenMobile: true,
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${row.activo
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}
                >
                    {row.activo ? 'Activo' : 'Suspendido'}
                </span>
            )
        }
    ];

    const actions = (row) => (
        <div className="flex items-center gap-1">
            <button
                onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                title="Editar"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <>
            <Card title="Directorio de Directivos (Dueños/Delegados)">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar nombre, teléfono, rol..."
                        className="w-full md:w-80 shadow-sm"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Directivo
                    </GradientButton>
                </div>
                <br />
                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse font-bold italic">
                        Cargando directivos...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredDirectivos}
                        actions={actions}
                        onRowClick={handleRowClick}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDirectivo ? "Editar Información" : "Registro de Nuevo Directivo"}
            >
                <DirectivoForm
                    directivo={editingDirectivo}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchDirectivos();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Ficha de Directivo"
            >
                {selectedDirectivo && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ 
                            backgroundColor: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '24px', 
                            border: '1px solid var(--color-border-subtle)',
                            boxShadow: 'var(--shadow-soft)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                                <div style={{ 
                                    padding: '16px', 
                                    backgroundColor: 'white', 
                                    borderRadius: 'var(--radius-md)', 
                                    border: '1px solid var(--color-border-subtle)', 
                                    color: 'var(--color-slate)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <User size={32} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nombre completo</p>
                                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-slate)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{selectedDirectivo.nombre}</h3>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rol Asignado</p>
                                    <span style={{ 
                                        fontWeight: 900, 
                                        color: selectedDirectivo.tipo?.nombre === 'Dueño Club' ? 'var(--color-primary)' : 'var(--color-gold)', 
                                        textTransform: 'uppercase',
                                        fontSize: '13px'
                                    }}>
                                        {selectedDirectivo.tipo?.nombre}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Phone size={12} /> Teléfono
                                        </p>
                                        <p style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedDirectivo.telefono || 'N/A'}</p>
                                    </div>
                                    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={12} /> Estado
                                        </p>
                                        <span style={{ 
                                            fontSize: '10px', 
                                            fontWeight: 900, 
                                            textTransform: 'uppercase',
                                            color: selectedDirectivo.activo ? 'var(--color-sage)' : 'var(--color-terra)'
                                        }}>
                                            {selectedDirectivo.activo ? 'Vigente' : 'Suspendido'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Mail size={12} /> Correo Electrónico
                                    </p>
                                    <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>{selectedDirectivo.correo_electronico || 'N/A'}</p>
                                </div>

                                <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} /> Dirección Física
                                    </p>
                                    <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '13px' }}>{selectedDirectivo.direccion || 'No registrada'}</p>
                                </div>
                            </div>
                        </div>

                        <GradientButton
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedDirectivo); }}
                            variant="primary"
                            icon={Edit}
                            style={{ width: '100%', padding: '16px' }}
                        >
                            Editar Información
                        </GradientButton>
                    </div>
                )}
            </Modal>
        </>
    );
}
