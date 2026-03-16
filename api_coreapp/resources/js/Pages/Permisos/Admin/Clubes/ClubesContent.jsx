import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import ClubForm from './ClubForm';
import { Plus, Edit, Trash2, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClubesContent() {
    const [clubes, setClubes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [selectedClub, setSelectedClub] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredClubes = clubes.filter(club =>
        club.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setEditingClub(null);
        setIsModalOpen(true);
    };

    const handleEdit = (club) => {
        setEditingClub(club);
        setIsModalOpen(true);
    };

    const handleRowClick = (club) => {
        setSelectedClub(club);
        setIsDetailModalOpen(true);
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
            header: 'Entidad',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">
                        {row.nombre}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${row.es_club ? 'text-slate-400' : 'text-orange-500'}`}>
                            {row.es_club ? 'Club Oficial' : 'Independiente'}
                        </span>
                        <div className="md:hidden">
                            {!row.activo && <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Teléfono',
            accessor: 'telefono',
            hiddenMobile: true,
            render: (row) => <span className="font-bold text-[13px] text-slate-500">{row.telefono || '-'}</span>
        },
        {
            header: 'Correo',
            accessor: 'correo',
            hiddenMobile: true,
            render: (row) => <span className="font-bold text-[13px] text-slate-500">{row.correo || '-'}</span>
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
            <Card title="Directorio de Clubes">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar clubes..."
                        className="w-full md:w-80 shadow-sm"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Club
                    </GradientButton>
                </div>
                <br />

                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse font-bold italic">
                        Cargando clubes...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredClubes}
                        actions={actions}
                        onRowClick={handleRowClick}
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

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Ficha de Club / Equipo"
            >
                {selectedClub && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-800">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Razón social / Nombre</p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedClub.nombre}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tipo de Afiliación</p>
                                    <span className={`font-black uppercase tracking-tight ${selectedClub.es_club ? 'text-blue-600' : 'text-orange-500'}`}>
                                        {selectedClub.es_club ? 'Club Oficial' : 'Registro Independiente'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Teléfono</p>
                                        <p className="font-bold text-slate-700">{selectedClub.telefono || 'Sin registro'}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Estado</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${selectedClub.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {selectedClub.activo ? 'Vigente' : 'Suspendido'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Correo Electrónico</p>
                                    <p className="font-bold text-slate-700 truncate">{selectedClub.correo || 'Sin correo registrado'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedClub); }}
                            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-premium"
                        >
                            Editar Información
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}
