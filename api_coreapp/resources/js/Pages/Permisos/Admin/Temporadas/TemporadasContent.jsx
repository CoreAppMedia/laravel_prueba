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
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingTemporada, setEditingTemporada] = useState(null);
    const [selectedTemporada, setSelectedTemporada] = useState(null);
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

    const handleRowClick = (temporada) => {
        setSelectedTemporada(temporada);
        setIsDetailModalOpen(true);
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
            header: 'Edición',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">
                        {row.nombre}
                    </span>
                    <div className="md:hidden flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            {row.activa ? 'Vigente' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Inicio',
            accessor: 'fecha_inicio',
            hiddenMobile: true,
            render: (row) => (
                <span className="font-bold text-[13px] text-slate-500">
                    {row.fecha_inicio}
                </span>
            )
        },
        {
            header: 'Término',
            accessor: 'fecha_fin',
            hiddenMobile: true,
            render: (row) => (
                <span className="font-bold text-[13px] text-slate-500">
                    {row.fecha_fin}
                </span>
            )
        },
        {
            header: 'Estado',
            accessor: 'activa',
            hiddenMobile: true,
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${row.activa
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                >
                    {row.activa ? 'Activa' : 'Inactiva'}
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
            <Card title="Temporadas">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar temporadas..."
                        className="w-full md:w-80 shadow-sm"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nueva Temporada
                    </GradientButton>
                </div>
                <br />

                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse font-bold italic">
                        Cargando temporadas...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredTemporadas}
                        actions={actions}
                        onRowClick={handleRowClick}
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

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Ficha de Temporada"
            >
                {selectedTemporada && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-orange-400">
                                    <Calendar size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Nombre de edición</p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedTemporada.nombre}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fecha Inicio</p>
                                        <p className="font-bold text-slate-700">{selectedTemporada.fecha_inicio}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fecha Fin</p>
                                        <p className="font-bold text-slate-700">{selectedTemporada.fecha_fin}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Situación actual</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedTemporada.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {selectedTemporada.activa ? 'Vigente' : 'Concluida'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedTemporada); }}
                            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-premium"
                        >
                            Editar Temporada
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}
