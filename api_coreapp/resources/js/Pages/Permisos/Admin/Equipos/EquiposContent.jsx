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
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingEquipo, setEditingEquipo] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
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
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Users size={10} className="text-blue-400" />
                            {row.club?.nombre || 'Independiente'}
                        </span>
                        <div className="md:hidden">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                {row.categoria?.nombre || 'General'}
                            </span>
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
                <div className="flex items-center gap-2 font-black text-[12px] text-orange-500 uppercase tracking-tight">
                    <Star size={14} className="text-orange-400" />
                    <span>{row.categoria?.nombre || 'General'}</span>
                </div>
            )
        },
        {
            header: 'Sede Oficial',
            accessor: 'cancha_id',
            hiddenMobile: true,
            render: (row) => {
                const diaMap = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom' };
                const diaText = row.cancha_horario?.dia_semana ? diaMap[row.cancha_horario.dia_semana] : '-';
                const horaText = row.cancha_horario?.hora ? row.cancha_horario.hora.substring(0, 5) : '-';

                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[13px] text-slate-600">
                            {row.cancha?.nombre || 'Sin definir'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {row.cancha_horario ? `${diaText} ${horaText}` : '-'}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Estatus',
            accessor: 'activo',
            hiddenMobile: true,
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${row.activo
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
        <>
            <Card title="Plantilla de Equipos">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar equipos..."
                        className="w-full md:w-80 shadow-sm"
                    />
                    <GradientButton onClick={handleCreate} icon={Plus}>
                        Nuevo Equipo
                    </GradientButton>
                </div>
                <br />

                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse font-bold italic">
                        Cargando equipos...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredEquipos}
                        actions={actions}
                        onRowClick={handleRowClick}
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

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Expediente de Equipo"
            >
                {selectedEquipo && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-500">
                                    <Users size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Nombre del equipo</p>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedEquipo.nombre_mostrado}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Club de Pertenencia</p>
                                    <span className="font-black text-slate-700 uppercase tracking-tight">
                                        {selectedEquipo.club?.nombre || 'Registro Independiente'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Categoría</p>
                                        <p className="font-black text-orange-500 uppercase">{selectedEquipo.categoria?.nombre || 'General'}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Estado</p>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${selectedEquipo.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {selectedEquipo.activo ? 'Activo' : 'Baja'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Sede y Horario Oficial</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-slate-700">{selectedEquipo.cancha?.nombre || 'Sin definir'}</p>
                                        <p className="text-xs font-black text-slate-400">
                                            {selectedEquipo.cancha_horario
                                                ? `${{ 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom' }[selectedEquipo.cancha_horario.dia_semana]} ${selectedEquipo.cancha_horario.hora.substring(0, 5)}`
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedEquipo); }}
                            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-premium"
                        >
                            Editar Expediente
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}
