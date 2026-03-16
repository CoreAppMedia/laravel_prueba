import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import ClubForm from './ClubForm';
import { Plus, Edit, Trash2, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClubesIndex() {
    const [clubes, setClubes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [selectedClub, setSelectedClub] = useState(null);

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
            header: 'Nombre',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight">
                        {row.nombre}
                    </span>
                    <div className="md:hidden flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            row.es_club ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600'
                        }`}>
                            {row.es_club ? 'Club' : 'Indep.'}
                        </span>
                        {!row.activo && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-50 text-red-500">
                                Supendido
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo',
            accessor: 'es_club',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex items-center gap-2 font-medium text-slate-600">
                    {row.es_club ? (
                        <ShieldCheck size={16} className="text-slate-400" />
                    ) : (
                        <User size={16} className="text-orange-400" />
                    )}
                    <span>{row.es_club ? 'Club' : 'Independiente'}</span>
                </div>
            )
        },
        { header: 'Teléfono', accessor: 'telefono', hiddenMobile: true },
        { header: 'Correo', accessor: 'correo', hiddenMobile: true },
        {
            header: 'Estado',
            accessor: 'activo',
            hiddenMobile: true,
            render: (row) => (
                <span 
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        row.activo 
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
        <BasePanel titulo="Gestión de Clubes" backUrl="/panel/admin">
            <Card title="Directorio de Clubes">
                <div className="flex justify-end mb-6">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Club / Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 italic font-medium animate-pulse">
                        Cargando clubes...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={clubes}
                        actions={actions}
                        onRowClick={handleRowClick}
                    />
                )}
            </Card>

            {/* Modal Formulario */}
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

            {/* Modal de Detalle (Mictlán Adaptive) */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detalles del Club"
            >
                {selectedClub && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-4 rounded-2xl ${selectedClub.es_club ? 'bg-slate-800 text-white' : 'bg-orange-500 text-white shadow-lg shadow-orange-200'}`}>
                                    {selectedClub.es_club ? <ShieldCheck size={32} /> : <User size={32} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                        {selectedClub.es_club ? 'Club Deportivo' : 'Equipo Independiente'}
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedClub.nombre}</h3>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Contacto Directo</p>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <span className="text-slate-400 text-xs uppercase tracking-tighter w-12 italic">Tel:</span>
                                            {selectedClub.telefono || 'No registrado'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <span className="text-slate-400 text-xs uppercase tracking-tighter w-12 italic">Mail:</span>
                                            {selectedClub.correo || 'No registrado'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus de competencia</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                        selectedClub.activo 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedClub.activo ? 'Activo / Vigente' : 'Suspendido / Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedClub); }}
                            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm hover:shadow-premium transition-all"
                        >
                            Editar Información
                        </button>
                    </div>
                )}
            </Modal>
        </BasePanel>
    );
}
