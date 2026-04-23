import Modal from '../../../../Components/UI/Modal';
import SearchBar from '../../../../Components/UI/SearchBar';
import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    DollarSign, 
    Plus, 
    Search, 
    Filter,
    ArrowUpCircle,
    ArrowDownCircle,
    FileText,
    TrendingUp,
    ChevronRight,
    Edit,
    Trash2,
    RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const GradientButton = ({ children, onClick, variant = 'primary', isLoading = false, type = "button", disabled = false }) => {
    const variants = {
        primary: 'from-[var(--color-gold)] to-[#b8860b] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]',
        secondary: 'from-[#1e293b] to-[#0f172a] text-white border border-slate-700',
        danger: 'from-[#ef4444] to-[#b91c1c] text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)]',
        success: 'from-[#10b981] to-[#047857] text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
    };

    return (
        <button
            type={type}
            disabled={isLoading || disabled}
            onClick={onClick}
            className={`
                relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300
                bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
            `}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

export default function FinanzasContent() {
    const [activeTab, setActiveTab] = useState('multas');
    const [torneos, setTorneos] = useState([]);
    const [selectedTorneoId, setSelectedTorneoId] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Auxiliares para formularios
    const [equipos, setEquipos] = useState([]);
    const [tiposMulta, setTiposMulta] = useState([]);

    // Datos
    const [multas, setMultas] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [balanceGlobal, setBalanceGlobal] = useState({ totales: { ingresos: 0, egresos: 0, balance: 0 }, categorias: { ingresos: [], egresos: [] } });
    const [resumenTorneo, setResumenTorneo] = useState(null);
    const [resumenJornada, setResumenJornada] = useState(null);

    // Modales y Forms
    const [isMultaModalOpen, setIsMultaModalOpen] = useState(false);
    const [multaForm, setMultaForm] = useState({ equipo_id: '', tipo_multa_id: '', motivo: '', monto: '', fecha: '' });
    const [editingMulta, setEditingMulta] = useState(null);

    const [isIngresoModalOpen, setIsIngresoModalOpen] = useState(false);
    const [ingresoForm, setIngresoForm] = useState({ torneo_id: '', concepto: '', categoria: '', monto: '', fecha: '' });

    const [isEgresoModalOpen, setIsEgresoModalOpen] = useState(false);
    const [egresoForm, setEgresoForm] = useState({ torneo_id: '', jornada_id: '', concepto: '', categoria: '', monto: '', fecha: '' });

    const [jornadas, setJornadas] = useState([]);
    const [selectedJornadaId, setSelectedJornadaId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTorneos();
        fetchAuxiliares();
        fetchBalanceGlobal();
    }, []);

    useEffect(() => {
        fetchData();
        if (selectedTorneoId) {
            fetchEquiposDelTorneo();
            fetchResumenTorneo();
            fetchJornadas();
            if (selectedJornadaId) {
                fetchResumenJornada();
            } else {
                setResumenJornada(null);
            }
        }
    }, [selectedTorneoId, activeTab, selectedJornadaId]);

    const fetchBalanceGlobal = async () => {
        try {
            const res = await http.get('/api/finanzas/balance-global');
            setBalanceGlobal(res.data);
        } catch (error) {
            console.error('Error al cargar balance global');
        }
    };

    const fetchResumenTorneo = async () => {
        if (!selectedTorneoId) return;
        try {
            const res = await http.get(`/api/finanzas/resumen-torneo/${selectedTorneoId}`);
            setResumenTorneo(res.data);
        } catch (error) {
            console.error('Error al cargar resumen del torneo');
        }
    };

    const fetchResumenJornada = async () => {
        if (!selectedTorneoId || !selectedJornadaId) return;
        try {
            const res = await http.get(`/api/finanzas/resumen-jornada/${selectedTorneoId}/${selectedJornadaId}`);
            setResumenJornada(res.data);
        } catch (error) {
            console.error('Error al cargar resumen de jornada');
        }
    };

    // Estilos internos
    const cardStyle = {
        backgroundColor: 'var(--color-bg-surface)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-sm)'
    };

    const inputStyle = {
        padding: '12px 16px',
        backgroundColor: 'var(--color-bg-surface-alt)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-primary)',
        outline: 'none',
        fontSize: '14px',
        transition: 'border-color 0.2s ease',
        width: '100%'
    };

    // Lógica de Filtrado con seguridad contra nulos
    const filteredMultas = multas.filter(m => 
        (m.equipo?.nombre_mostrado?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.tipo_multa?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.motivo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredIngresos = ingresos.filter(i => 
        (i.concepto?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (i.categoria?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredEgresos = egresos.filter(e => 
        (e.concepto?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (e.categoria?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const fetchTorneos = async () => {
        try {
            const res = await http.get('/api/torneos');
            setTorneos(res.data);
            if (res.data.length > 0 && !selectedTorneoId) {
                setSelectedTorneoId(res.data[0].id);
            }
        } catch (error) {
            toast.error('Error al cargar torneos');
        }
    };

    const fetchAuxiliares = async () => {
        try {
            const resTM = await http.get('/api/catalogos/tipos-multa');
            setTiposMulta(resTM.data);
        } catch (error) {
            console.error('Error al cargar auxiliares');
        }
    };

    const fetchEquiposDelTorneo = async () => {
        if (!selectedTorneoId) return;
        try {
            const res = await http.get(`/api/torneos/${selectedTorneoId}/equipos-inscritos`);
            setEquipos(res.data);
        } catch (error) {
            console.error('Error al cargar equipos');
        }
    };

    const fetchJornadas = async () => {
        if (!selectedTorneoId) return;
        try {
            const res = await http.get(`/api/torneos/${selectedTorneoId}/jornadas`);
            setJornadas(res.data);
        } catch (error) {
            console.error('Error al cargar jornadas');
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { 
                torneo_id: selectedTorneoId || undefined,
                jornada_id: selectedJornadaId || undefined
            };
            if (activeTab === 'multas') {
                const res = await http.get('/api/multas', { params });
                setMultas(res.data);
            } else if (activeTab === 'ingresos') {
                const res = await http.get('/api/ingresos', { params });
                setIngresos(res.data);
            } else if (activeTab === 'egresos') {
                const res = await http.get('/api/egresos', { params });
                setEgresos(res.data);
            }
        } catch (error) {
            toast.error('Error al cargar datos financieros');
        } finally {
            setLoading(false);
        }
    };

    const handlePagoMulta = async (multaId) => {
        try {
            await http.patch(`/api/multas/${multaId}/pago`, { pagada: true, metodo_pago: 'Efectivo' });
            toast.success('¡Pago registrado con éxito! Se cargó a Ingresos.');
            fetchData();
            fetchBalanceGlobal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al procesar el pago');
        }
    };

    const handleMultaSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingMulta) {
                // Al editar solo enviar campos permitidos: motivo, monto, fecha
                const updateData = {
                    motivo: multaForm.motivo,
                    monto: multaForm.monto,
                    fecha: multaForm.fecha
                };
                await http.put(`/api/multas/${editingMulta.id}`, updateData);
                toast.success('Multa actualizada correctamente');
            } else {
                await http.post('/api/multas', { ...multaForm, torneo_id: selectedTorneoId });
                toast.success('Multa aplicada correctamente');
            }
            setIsMultaModalOpen(false);
            setEditingMulta(null);
            setMultaForm({ equipo_id: '', tipo_multa_id: '', motivo: '', monto: '', fecha: '' });
            fetchData();
            fetchBalanceGlobal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar multa');
        } finally {
            setSaving(false);
        }
    };

    const handleEditMulta = (multa) => {
        setEditingMulta(multa);
        setMultaForm({
            equipo_id: multa.equipo_id,
            tipo_multa_id: multa.tipo_multa_id,
            motivo: multa.motivo,
            monto: multa.monto,
            fecha: multa.fecha?.split('T')[0] || ''
        });
        setIsMultaModalOpen(true);
    };

    const handleDeleteMulta = async (multaId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta multa? Esta acción no se puede deshacer.')) return;
        try {
            await http.delete(`/api/multas/${multaId}`);
            toast.success('Multa eliminada correctamente');
            fetchData();
            fetchBalanceGlobal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar multa');
        }
    };

    const handleIngresoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post('/api/ingresos', ingresoForm);
            toast.success('Ingreso registrado correctamente');
            setIsIngresoModalOpen(false);
            setIngresoForm({ torneo_id: selectedTorneoId, concepto: '', categoria: '', monto: '', fecha: '' });
            fetchData();
            fetchBalanceGlobal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar ingreso');
        } finally {
            setSaving(false);
        }
    };

    const handleEgresoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post('/api/egresos', egresoForm);
            toast.success('Gasto registrado con éxito');
            setIsEgresoModalOpen(false);
            setEgresoForm({ torneo_id: selectedTorneoId, jornada_id: '', concepto: '', categoria: '', monto: '', fecha: '' });
            fetchData();
            fetchBalanceGlobal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar egreso');
        } finally {
            setSaving(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchBalanceGlobal(),
                fetchData(),
                selectedTorneoId ? fetchResumenTorneo() : Promise.resolve(),
                (selectedTorneoId && selectedJornadaId) ? fetchResumenJornada() : Promise.resolve()
            ]);
            toast.success('Datos actualizados');
        } catch (error) {
            console.error('Error al refrescar:', error);
        } finally {
            setLoading(false);
        }
    };

    const SummaryCards = () => {
        const balance = balanceGlobal.totales.balance || 0;
        const isNegative = balance < 0;
        
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '8px' }}>
                {/* Caja General (Balance) - Azul o Rojo si es negativo */}
                <div style={{ 
                    ...cardStyle, 
                    background: isNegative ? '#ff3b30' : '#0071e3', 
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>Caja General (Balance)</span>
                        <DollarSign size={20} color="white" />
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                        ${balance.toLocaleString('es-MX')}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Efectivo real disponible en la liga</div>
                </div>
                
                {/* Ingresos Totales - Verde */}
                <div style={{ 
                    ...cardStyle, 
                    background: '#34c759', 
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(52,199,89,0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>Ingresos Totales</span>
                        <ArrowUpCircle size={20} color="white" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>
                        +${(balanceGlobal.totales.ingresos || 0).toLocaleString('es-MX')}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Monto acumulado histórico</div>
                </div>

                {/* Egresos Totales - Rojo */}
                <div style={{ 
                    ...cardStyle, 
                    background: '#ff3b30', 
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(255,59,48,0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>Egresos Totales</span>
                        <ArrowDownCircle size={20} color="white" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>
                        -${(balanceGlobal.totales.egresos || 0).toLocaleString('es-MX')}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Gastos operativos y premios</div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease' }}>
            {/* Dashboard Superior */}
            <SummaryCards />

            {/* Header / Selector de Torneo */}
            <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                        Gestión Financiera
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Control de flujo de caja y reportes por torneo.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={handleRefresh}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: 'white',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            color: '#0071e3',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Actualizar
                    </button>

                    <select 
                        value={selectedJornadaId}
                        onChange={(e) => setSelectedJornadaId(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: 'var(--color-bg-surface-alt)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                            fontSize: '14px',
                            minWidth: '180px'
                        }}
                    >
                        <option value="">Balance por Jornada...</option>
                        {jornadas.map(j => (
                            <option key={j.id} value={j.id}>Jornada {j.numero}</option>
                        ))}
                    </select>

                    <div style={{ position: 'relative' }}>
                        <Filter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
                        <select 
                            value={selectedTorneoId}
                            onChange={(e) => setSelectedTorneoId(e.target.value)}
                            style={{
                                padding: '10px 16px 10px 36px',
                                backgroundColor: 'var(--color-bg-surface-alt)',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                outline: 'none',
                                fontSize: '14px',
                                minWidth: '240px'
                            }}
                        >
                            <option value="">Seleccionar Torneo...</option>
                            {torneos.map(t => (
                                <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Navegación por Pestañas */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '2px' }}>
                {[
                    { id: 'multas', label: 'Multas', icon: AlertCircle },
                    { id: 'ingresos', label: 'Ingresos', icon: ArrowUpCircle },
                    { id: 'egresos', label: 'Egresos', icon: ArrowDownCircle },
                    { id: 'resumen', label: 'Resumen y Categorías', icon: FileText },
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSearchTerm('');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                border: 'none',
                                background: 'transparent',
                                borderBottom: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                                fontWeight: isActive ? 800 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '14px'
                            }}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Contenido Dinámico */}
            <div style={{ minHeight: '400px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Cargando información financiera...
                    </div>
                ) : (
                    <>
                        {activeTab === 'multas' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>Listado de Multas</h3>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                                        <SearchBar 
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                            placeholder="Buscar por equipo o motivo..."
                                            width="280px"
                                        />
                                        <button 
                                            onClick={() => setIsMultaModalOpen(true)}
                                            className="btn btn-gold" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                        >
                                            <Plus size={16} /> Aplicar Multa 
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="table-container">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Equipo</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Concepto / Motivo</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Monto</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Estatus</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMultas.map(multa => (
                                                <tr key={multa.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <td style={{ padding: '16px 12px', fontWeight: 700 }}>{multa.equipo?.nombre_mostrado}</td>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{multa.tipo_multa?.nombre}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{multa.motivo}</div>
                                                    </td>
                                                    <td style={{ padding: '16px 12px', color: 'var(--color-gold)', fontWeight: 800 }}>${multa.monto}</td>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        {multa.pagada ? (
                                                            <span style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', borderRadius: '6px', fontWeight: 800 }}>PAGADA</span>
                                                        ) : (
                                                            <span style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: 'var(--color-terra-light)', color: 'var(--color-terra)', borderRadius: '6px', fontWeight: 800 }}>PENDIENTE</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            {!multa.pagada && (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handlePagoMulta(multa.id)}
                                                                        style={{ padding: '6px 12px', color: 'var(--color-gold)', background: 'transparent', border: '1px solid var(--color-gold)', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                                                    >
                                                                        Liquidar
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleEditMulta(multa)}
                                                                        style={{ padding: '6px 10px', color: 'var(--color-slate)', background: 'transparent', border: '1px solid var(--color-slate)', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                                                        title="Editar"
                                                                    >
                                                                        <Edit size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteMulta(multa.id)}
                                                                        style={{ padding: '6px 10px', color: 'var(--color-terra)', background: 'transparent', border: '1px solid var(--color-terra)', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {multa.pagada && (
                                                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                                    Pagada - Sin acciones
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {multas.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay multas registradas en este torneo.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ingresos' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>Flujo de Ingresos</h3>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                                        <SearchBar 
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                            placeholder="Buscar ingreso..."
                                            width="280px"
                                        />
                                        <button 
                                            onClick={() => {
                                                setIngresoForm({ ...ingresoForm, torneo_id: selectedTorneoId });
                                                setIsIngresoModalOpen(true);
                                            }}
                                            className="btn btn-gold" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                        >
                                            <Plus size={16} /> Nuevo Ingreso
                                        </button>
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Fecha</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Concepto</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Categoría</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredIngresos.map(ingreso => (
                                                <tr key={ingreso.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <td style={{ padding: '16px 12px' }}>{new Date(ingreso.fecha).toLocaleDateString()}</td>
                                                    <td style={{ padding: '16px 12px', fontWeight: 600 }}>
                                                        {ingreso.concepto}
                                                        {!ingreso.torneo_id && <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '2px 4px', borderRadius: '4px' }}>GENERAL</span>}
                                                    </td>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '6px', color: 'var(--color-text-muted)' }}>
                                                            {ingreso.categoria || 'Sin categoría'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 12px', color: 'var(--color-sage)', fontWeight: 800 }}>+ ${ingreso.monto}</td>
                                                </tr>
                                            ))}
                                            {ingresos.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay ingresos registrados.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'egresos' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, margin: 0 }}>Registro de Egresos</h3>
                                        <select 
                                            value={selectedJornadaId}
                                            onChange={(e) => setSelectedJornadaId(e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: 'var(--color-bg-surface-alt)',
                                                border: '1px solid var(--color-border-subtle)',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                color: 'var(--color-text-primary)'
                                            }}
                                        >
                                            <option value="">Todas las Jornadas</option>
                                            {jornadas.map(j => (
                                                <option key={j.id} value={j.id}>Jornada {j.numero}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                                        <SearchBar 
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                            placeholder="Buscar egreso..."
                                            width="280px"
                                        />
                                        <button 
                                            onClick={() => {
                                                setEgresoForm({ ...egresoForm, torneo_id: selectedTorneoId });
                                                setIsEgresoModalOpen(true);
                                            }}
                                            className="btn btn-gold" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                        >
                                            <Plus size={16} /> Nuevo Egreso
                                        </button>
                                    </div>
                                </div>
                                <div className="table-container">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Fecha</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Concepto</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Categoría</th>
                                                <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEgresos.map(egreso => (
                                                <tr key={egreso.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <td style={{ padding: '16px 12px' }}>{new Date(egreso.fecha).toLocaleDateString()}</td>
                                                    <td style={{ padding: '16px 12px', fontWeight: 600 }}>
                                                        {egreso.concepto}
                                                        {!egreso.torneo_id && <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '2px 4px', borderRadius: '4px' }}>GENERAL</span>}
                                                    </td>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '6px', color: 'var(--color-text-muted)' }}>
                                                            {egreso.categoria || 'Sin categoría'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 12px', color: 'var(--color-terra)', fontWeight: 800 }}>- ${egreso.monto}</td>
                                                </tr>
                                            ))}
                                            {egresos.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay gastos registrados.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resumen' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    {/* Ingresos por Categoría */}
                                    <div style={cardStyle}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Ingresos por Categoría</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {balanceGlobal.categorias.ingresos.map((cat, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{cat.categoria || 'General'}</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-sage)' }}>${parseFloat(cat.total).toLocaleString('es-MX')}</span>
                                                </div>
                                            ))}
                                            {balanceGlobal.categorias.ingresos.length === 0 && <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center' }}>No hay datos disponibles.</p>}
                                        </div>
                                    </div>
                                    
                                    {/* Egresos por Categoría */}
                                    <div style={cardStyle}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Egresos por Categoría</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {balanceGlobal.categorias.egresos.map((cat, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{cat.categoria || 'General'}</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-terra)' }}>${parseFloat(cat.total).toLocaleString('es-MX')}</span>
                                                </div>
                                            ))}
                                            {balanceGlobal.categorias.egresos.length === 0 && <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center' }}>No hay datos disponibles.</p>}
                                        </div>
                                    </div>
                                </div> {/* Closing the grid div */}

                                {resumenTorneo && (
                                    <div style={{ ...cardStyle, borderLeft: '4px solid var(--color-gold)' }}>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Resumen del Torneo Seleccionado</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>{resumenTorneo.torneo}</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Ingresos</div>
                                                <div style={{ fontSize: '18px', fontWeight: 800 }}>${parseFloat(resumenTorneo.ingresos).toLocaleString('es-MX')}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Egresos</div>
                                                <div style={{ fontSize: '18px', fontWeight: 800 }}>${parseFloat(resumenTorneo.egresos).toLocaleString('es-MX')}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Balance</div>
                                                <div style={{ fontSize: '18px', fontWeight: 800, color: resumenTorneo.balance >= 0 ? 'var(--color-sage)' : 'var(--color-terra)' }}>
                                                    ${parseFloat(resumenTorneo.balance).toLocaleString('es-MX')}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Rentabilidad</div>
                                                <div style={{ fontSize: '18px', fontWeight: 800 }}>
                                                    {resumenTorneo.ingresos > 0 ? ((resumenTorneo.balance / resumenTorneo.ingresos) * 100).toFixed(1) : 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {resumenJornada && (
                                    <div style={{ ...cardStyle, borderLeft: '4px solid var(--color-sage)', background: 'rgba(45,134,83,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <div>
                                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Balance de Jornada {resumenJornada.jornada}</h3>
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Periodo: {resumenJornada.fecha_periodo}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Utilidad Neta de Jornada</div>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: resumenJornada.totales.balance >= 0 ? 'var(--color-sage)' : 'var(--color-terra)' }}>
                                                    ${parseFloat(resumenJornada.totales.balance).toLocaleString('es-MX')}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-sage)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <ArrowUpCircle size={14} /> INGRESOS COBRADOS (ARBITRAJE)
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {resumenJornada.ingresos.map(ing => (
                                                        <div key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '6px' }}>
                                                            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{ing.concepto.split(':')[1]?.trim() || ing.concepto}</span>
                                                            <span style={{ color: 'var(--color-sage)', fontWeight: 800 }}>+${parseFloat(ing.monto).toLocaleString('es-MX')}</span>
                                                        </div>
                                                    ))}
                                                    {resumenJornada.ingresos.length === 0 && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center' }}>Sin ingresos registrados.</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-terra)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <ArrowDownCircle size={14} /> GASTOS PAGADOS (ÁRBITROS)
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {resumenJornada.egresos.filter(e => e.categoria === 'arbitraje').map(egr => (
                                                        <div key={egr.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '6px' }}>
                                                            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{egr.concepto}</span>
                                                            <span style={{ color: 'var(--color-terra)', fontWeight: 800 }}>-${parseFloat(egr.monto).toLocaleString('es-MX')}</span>
                                                        </div>
                                                    ))}
                                                    {resumenJornada.egresos.filter(e => e.categoria === 'arbitraje').length === 0 && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center' }}>Sin gastos registrados.</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>* Este balance contempla únicamente ingresos y egresos de la categoría <strong>arbitraje</strong> para esta jornada.</span>
                                            <div style={{ display: 'flex', gap: '24px' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Total Ingresos</div>
                                                    <div style={{ fontWeight: 800, color: 'var(--color-sage)' }}>${parseFloat(resumenJornada.totales.ingresos).toLocaleString('es-MX')}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Total Egresos</div>
                                                    <div style={{ fontWeight: 800, color: 'var(--color-terra)' }}>${parseFloat(resumenJornada.totales.egresos).toLocaleString('es-MX')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal: Nueva/Editar Multa */}
            <Modal isOpen={isMultaModalOpen} onClose={() => { setIsMultaModalOpen(false); setEditingMulta(null); setMultaForm({ equipo_id: '', tipo_multa_id: '', motivo: '', monto: '', fecha: '' }); }} title={editingMulta ? "Editar Multa" : "Aplicar Nueva Multa"}>
                <form onSubmit={handleMultaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Equipo Sancionado</label>
                            <select 
                                required
                                style={inputStyle} 
                                value={multaForm.equipo_id} 
                                onChange={e => setMultaForm({ ...multaForm, equipo_id: e.target.value })}
                            >
                                <option value="">Selecciona un equipo...</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.nombre_mostrado}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Tipo de Multa</label>
                            <select 
                                required
                                style={inputStyle} 
                                value={multaForm.tipo_multa_id} 
                                onChange={e => {
                                    const tipo = tiposMulta.find(t => t.id === e.target.value);
                                    setMultaForm({ ...multaForm, tipo_multa_id: e.target.value, monto: tipo?.monto_default || '' });
                                }}
                            >
                                <option value="">Selecciona el tipo...</option>
                                {tiposMulta.map(tm => (
                                    <option key={tm.id} value={tm.id}>{tm.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label">Motivo Detallado</label>
                        <textarea 
                            required
                            style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} 
                            value={multaForm.motivo} 
                            onChange={e => setMultaForm({ ...multaForm, motivo: e.target.value })}
                            placeholder="Ej. El delegado presentó una protesta indebida..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Monto ($)</label>
                            <input 
                                type="number" 
                                required 
                                step="0.01" 
                                style={inputStyle} 
                                value={multaForm.monto} 
                                onChange={e => setMultaForm({ ...multaForm, monto: e.target.value })} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Fecha del Incidente</label>
                            <input 
                                type="date" 
                                style={inputStyle} 
                                value={multaForm.fecha} 
                                onChange={e => setMultaForm({ ...multaForm, fecha: e.target.value })} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => { setIsMultaModalOpen(false); setEditingMulta(null); setMultaForm({ equipo_id: '', tipo_multa_id: '', motivo: '', monto: '', fecha: '' }); }} className="btn btn-ghost">Cancelar</button>
                        <GradientButton type="submit" isLoading={saving}>{editingMulta ? 'Guardar Cambios' : 'Registrar Multa'}</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal: Nuevo Ingreso */}
            <Modal isOpen={isIngresoModalOpen} onClose={() => setIsIngresoModalOpen(false)} title="Registrar Ingreso Manual">
                <form onSubmit={handleIngresoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Asociar a Torneo</label>
                            <select 
                                style={inputStyle} 
                                value={ingresoForm.torneo_id} 
                                onChange={e => setIngresoForm({ ...ingresoForm, torneo_id: e.target.value })}
                            >
                                <option value="">Caja General (Sin Torneo)</option>
                                {torneos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Categoría</label>
                            <input 
                                type="text" 
                                list="income-categories"
                                style={inputStyle} 
                                placeholder="Ej. Patrocinio, Inscripción..." 
                                value={ingresoForm.categoria} 
                                onChange={e => setIngresoForm({ ...ingresoForm, categoria: e.target.value })} 
                            />
                            <datalist id="income-categories">
                                <option value="inscripcion">Inscripción</option>
                                <option value="patrocinio">Patrocinio</option>
                                <option value="venta">Venta de artículos</option>
                                <option value="multa">Multa</option>
                            </datalist>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label">Concepto del Ingreso</label>
                        <input 
                            type="text" 
                            required 
                            style={inputStyle} 
                            placeholder="Ej. Pago de inscripción equipo Águilas..." 
                            value={ingresoForm.concepto} 
                            onChange={e => setIngresoForm({ ...ingresoForm, concepto: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Monto ($)</label>
                            <input 
                                type="number" 
                                required 
                                step="0.01" 
                                style={inputStyle} 
                                value={ingresoForm.monto} 
                                onChange={e => setIngresoForm({ ...ingresoForm, monto: e.target.value })} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Fecha</label>
                            <input 
                                type="date" 
                                style={inputStyle} 
                                value={ingresoForm.fecha} 
                                onChange={e => setIngresoForm({ ...ingresoForm, fecha: e.target.value })} 
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => setIsIngresoModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                        <GradientButton type="submit" isLoading={saving}>Guardar Ingreso</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* Modal: Nuevo Egreso */}
            <Modal isOpen={isEgresoModalOpen} onClose={() => setIsEgresoModalOpen(false)} title="Registrar Gasto (Egreso)">
                <form onSubmit={handleEgresoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Asociar a Torneo</label>
                            <select 
                                style={inputStyle} 
                                value={egresoForm.torneo_id} 
                                onChange={e => setEgresoForm({ ...egresoForm, torneo_id: e.target.value, jornada_id: '' })}
                            >
                                <option value="">Caja General (Sin Torneo)</option>
                                {torneos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Categoría</label>
                            <input 
                                type="text" 
                                list="expense-categories"
                                style={inputStyle} 
                                placeholder="Ej. Arbitraje, Premios, Limpieza..." 
                                value={egresoForm.categoria} 
                                onChange={e => setEgresoForm({ ...egresoForm, categoria: e.target.value })} 
                            />
                            <datalist id="expense-categories">
                                <option value="arbitraje">Arbitraje</option>
                                <option value="articulos">Artículos / Material</option>
                                <option value="premios">Premios / Trofeos</option>
                                <option value="limpieza">Limpieza</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </datalist>
                        </div>
                    </div>
                    
                    {egresoForm.torneo_id && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Jornada (Opcional)</label>
                            <select 
                                style={inputStyle} 
                                value={egresoForm.jornada_id} 
                                onChange={e => setEgresoForm({ ...egresoForm, jornada_id: e.target.value })}
                            >
                                <option value="">No aplica a jornada específica</option>
                                {jornadas.map(j => (
                                    <option key={j.id} value={j.id}>Jornada {j.numero}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label">Concepto del Gasto</label>
                        <input 
                            type="text" 
                            required 
                            style={inputStyle} 
                            placeholder="Ej. Compra de trofeos para clausura..." 
                            value={egresoForm.concepto} 
                            onChange={e => setEgresoForm({ ...egresoForm, concepto: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Monto ($)</label>
                            <input 
                                type="number" 
                                required 
                                step="0.01" 
                                style={inputStyle} 
                                value={egresoForm.monto} 
                                onChange={e => setEgresoForm({ ...egresoForm, monto: e.target.value })} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label className="text-label">Fecha</label>
                            <input 
                                type="date" 
                                style={inputStyle} 
                                value={egresoForm.fecha} 
                                onChange={e => setEgresoForm({ ...egresoForm, fecha: e.target.value })} 
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button type="button" onClick={() => setIsEgresoModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                        <GradientButton type="submit" isLoading={saving} variant="danger">Confirmar Gasto</GradientButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
