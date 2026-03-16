import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import BasePanel from '../../BasePanel';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import EquipoForm from './EquipoForm';
import { Plus, Edit, Trash2, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EquiposIndex() {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingEquipo, setEditingEquipo] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);

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

    const handleCreate = () => {
        setEditingEquipo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (equipo) => {
        setEditingEquipo(equipo);
        setIsModalOpen(true);
    };

    const handleRowClick = (equipo) => {
        setSelectedEquipo(equipo);
        setIsDetailModalOpen(true);
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
                <div className="flex flex-col gap-1">
                    <span className="font-black text-[15px] text-slate-800 tracking-tight leading-tight">
                        {row.nombre_mostrado}
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                            <Users size={10} className="text-orange-400" />
                            {row.club?.nombre || 'Independiente'}
                        </span>
                        <div className="md:hidden flex items-center gap-2">
                             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                {row.categoria?.nombre || 'Libre'}
                            </span>
                            {!row.activo && <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            accessor: 'categoria',
            hiddenMobile: true,
            render: (row) => (
                <div className="flex items-center gap-2 font-black text-[11px] text-blue-600 uppercase tracking-widest">
                    <Star size={14} className="text-blue-200 fill-blue-50" />
                    <span>{row.categoria?.nombre || 'General'}</span>
                </div>
            )
        },
        {
            header: 'Estatus',
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
                    {row.activo ? 'Activo' : 'Baja'}
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
        <BasePanel titulo="Gestión de Equipos" backUrl="/panel/admin">
            <Card title="Equipos">
                <div className="flex justify-end mb-6">
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Registrar Nuevo Equipo
                    </GradientButton>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 italic font-bold animate-pulse">
                        Cargando plantilla...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={equipos}
                        actions={actions}
                        onRowClick={handleRowClick}
                    />
                )}
            </Card>

            {/* Modal Formulario */}
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

            {/* Modal Detalle (Mictlán Adaptive) */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Ficha del Equipo"
            >
                {selectedEquipo && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <Star size={32} className="text-orange-400 fill-orange-50" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Nombre de competencia</p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedEquipo.nombre_mostrado}</h3>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Organización / Club</p>
                                    <p className="font-bold text-slate-700 flex items-center gap-2">
                                        <Users size={14} className="text-slate-400" />
                                        {selectedEquipo.club?.nombre || 'Equipo Independiente'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Categoría</p>
                                        <p className="font-black text-blue-600 uppercase tracking-tight">{selectedEquipo.categoria?.nombre || 'General'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Estado</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            selectedEquipo.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {selectedEquipo.activo ? 'Vigente' : 'De Baja'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedEquipo); }}
                            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-premium"
                        >
                            Editar Información
                        </button>
                    </div>
                )}
            </Modal>
        </BasePanel>
    );
}
