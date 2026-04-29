import React, { useState, useEffect } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import GradientButton from '../../../../Components/UI/GradientButton';
import Modal from '../../../../Components/UI/Modal';
import { 
    Plus, Check, Calendar, Trophy, Trash2, Pause, Play, AlertCircle, 
    ArrowLeft, Lock, Shield, User, DollarSign, X, MapPin, Clock, Mail, 
    Banknote, FileText, XCircle, TrendingUp, TrendingDown, Activity,
    AlertTriangle, PlusCircle, Users, CheckCircle, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReciboArbitrajeJornadaTemplate from '../../../../Components/ReciboArbitrajeJornadaTemplate';
import { useReactToPrint } from 'react-to-print';
import JornadaPDFExport from '../../../../Components/JornadaPDFExport';

// ────────────────────────────────────────────────
// Sub‑view: Detail of a single Jornada
// ────────────────────────────────────────────────
function JornadaDetail({
    jornada,
    torneo,
    equiposInscritos,
    onBack,
    onRefresh,
}) {
    const [isPartidoModalOpen, setIsPartidoModalOpen] = useState(false);
    const [isResultadoModalOpen, setIsResultadoModalOpen] = useState(false);
    const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
    const [isPartidoSuspensionModalOpen, setIsPartidoSuspensionModalOpen] = useState(false);
    const [isCierreModalOpen, setIsCierreModalOpen] = useState(false);
    const [isArbitroModalOpen, setIsArbitroModalOpen] = useState(false);
    const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [pendingList, setPendingList] = useState([]);
    const [arbitrosCatalog, setArbitrosCatalog] = useState([]);
    
    const pdfRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => pdfRef.current,
        documentTitle: `Jornada_${jornada.numero}_Rol_de_Juego`,
    });

    const [partidoForm, setPartidoForm] = useState({
        equipo_local_id: '',
        equipo_visitante_id: '',
        cancha_id: '',
        cancha_horario_id: '',
        arbitro_id: '',
        pago_arbitro: torneo.monto_pago_arbitro || 0,
        rol: 'Central'
    });
    const [resultadoForm, setResultadoForm] = useState({ goles_local: 0, goles_visitante: 0 });
    const [selectedPartido, setSelectedPartido] = useState(null);
    const [motivo, setMotivo] = useState('');
    const [motivoPartido, setMotivoPartido] = useState('');
    const [suspendPartidoId, setSuspendPartidoId] = useState(null);
    const [arbitroForm, setArbitroForm] = useState({ arbitro_id: '', rol: 'Central', pago: torneo.monto_pago_arbitro || 0 });
    const [targetPartidoId, setTargetPartidoId] = useState(null);
    const [paymentForm, setPaymentForm] = useState({ pivotId: null, pagado: false, motivo_pago: '' });
    const [summaryData, setSummaryData] = useState({ totalCobrado: 0, totalEgresosArbitros: 0 });
    const [jornadaResumen, setJornadaResumen] = useState(null);
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const selectedLocalForm = equiposInscritos.find(e => e.id === partidoForm.equipo_local_id);
    const selectedVisitForm = equiposInscritos.find(e => e.id === partidoForm.equipo_visitante_id);
    // IDs de equipos que ya tienen un partido en esta jornada
    const usedTeamIds = new Set(
        (jornada.partidos || []).flatMap(p => [p.equipo_local_id, p.equipo_visitante_id].filter(Boolean))
    );

    const diaSemanaMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };
    const formatHora = (t) => (typeof t === 'string' ? t.substring(0, 5) + ' hrs' : '');

    useEffect(() => {
        const fetchArbitros = async () => {
            try {
                const res = await http.get(`/api/torneos/${torneo.id}/arbitros`);
                setArbitrosCatalog(res.data.filter(a => a.activo));
            } catch (error) {
                console.error('Error fetching arbitros', error);
            }
        };
        fetchArbitros();
    }, [torneo.id]);

    // Sincronizar precios por defecto cuando el torneo carga o cambia
    useEffect(() => {
        const defaultPago = parseFloat(torneo.monto_pago_arbitro || 0);
        if (defaultPago > 0) {
            setPartidoForm(prev => ({ ...prev, pago_arbitro: defaultPago }));
            setArbitroForm(prev => ({ ...prev, pago: defaultPago }));
        }
    }, [torneo.monto_pago_arbitro]);

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

    const handlePartidoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);
        try {
            // Limpiamos los campos de arbitraje si no se seleccionó árbitro
            const dataToSend = { ...partidoForm };
            if (!dataToSend.arbitro_id) {
                delete dataToSend.arbitro_id;
                delete dataToSend.rol;
                delete dataToSend.pago_arbitro;
            }
            await http.post(`/api/jornadas/${jornada.id}/partidos`, dataToSend);
            toast.success('Partido programado con éxito');
            setIsPartidoModalOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Error al programar partido:', error.response?.data);
            const msg = error.response?.data?.message || 'Error al programar el partido';
            setFormError(msg);
            toast.error(msg, {
                duration: 5000,
                position: 'top-center',
                style: {
                    border: '1px solid var(--color-terra)',
                    padding: '16px',
                    color: 'var(--color-slate)',
                    backgroundColor: 'var(--color-terra-light)',
                    fontWeight: '700',
                },
                iconTheme: {
                    primary: 'var(--color-terra)',
                    secondary: '#FFFAEE',
                },
            });
        } finally {
            setSaving(false);
        }
    };

    const handleResultadoSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/partidos/${selectedPartido.id}/resultado`, resultadoForm);
            toast.success('Resultado guardado');
            setIsResultadoModalOpen(false);
            onRefresh();
        } catch (error) {
            toast.error('Error al guardar resultado');
        } finally {
            setSaving(false);
        }
    };

    const handleClosePartido = async (partidoId) => {
        if (!window.confirm('¿Deseas cerrar el partido? Ya no podrás editar el resultado.')) return;
        try {
            await http.patch(`/api/partidos/${partidoId}/cerrar`);
            toast.success('Partido cerrado definitivamente');
            onRefresh();
        } catch (error) {
            toast.error('Error al cerrar partido');
        }
    };

    const handleSuspenderPartido = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/partidos/${suspendPartidoId}/suspender`, { motivo_suspension: motivoPartido });
            toast.success('Partido marcado como suspendido');
            setIsPartidoSuspensionModalOpen(false);
            setSuspendPartidoId(null);
            setMotivoPartido('');
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al suspender partido');
        } finally {
            setSaving(false);
        }
    };

    const handleReactivarPartido = async (partidoId) => {
        try {
            await http.patch(`/api/partidos/${partidoId}/reactivar`);
            toast.success('Partido reactivado');
            onRefresh();
        } catch (error) {
            toast.error('Error al reactivar partido');
        }
    };

    const handleCloseJornada = async () => {
        const pending = (jornada.partidos || []).filter(p => !p.cerrado && !p.suspendido);
        setPendingList(pending);
        
        if (pending.length === 0) {
            setLoadingResumen(true);
            try {
                const res = await http.get(`/api/finanzas/resumen-jornada/${torneo.id}/${jornada.id}`);
                setJornadaResumen(res.data);
                
                // Compatibilidad con lógica anterior
                setSummaryData({ 
                    totalCobrado: res.data.totales.ingresos, 
                    totalEgresosArbitros: res.data.detalles_arbitraje.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0) 
                });
            } catch (error) {
                console.error("Error al cargar preventa de resumen:", error);
            } finally {
                setLoadingResumen(false);
            }
        }

        setIsCierreModalOpen(true);
    };

    const handleVerResumen = async () => {
        setLoadingResumen(true);
        try {
            const res = await http.get(`/api/finanzas/resumen-jornada/${torneo.id}/${jornada.id}`);
            setJornadaResumen(res.data);
            setSummaryData({ 
                totalCobrado: res.data.totales.ingresos, 
                totalEgresosArbitros: res.data.detalles_arbitraje.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0) 
            });
            setIsCierreModalOpen(true);
        } catch (error) {
            toast.error('Error al cargar resumen financiero');
        } finally {
            setLoadingResumen(false);
        }
    };

    const handleConfirmCierre = async () => {
        try {
            await http.patch(`/api/jornadas/${jornada.id}/cerrar`);
            toast.success('Jornada cerrada correctamente');
            
            // Recargar datos para que los nuevos egresos individuales aparezcan en el modal
            await handleVerResumen(); 
            
            onRefresh();
            // Ya no cerramos el modal ni volvemos atrás inmediatamente para que el usuario vea el reporte final y pueda imprimir
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al cerrar jornada';
            const pending = error.response?.data?.partidos_pendientes || [];
            setPendingList(pending.map ? pending : []);
            toast.error(msg);
        }
    };

    const handleSuspenderJornada = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/jornadas/${jornada.id}/suspender`, { motivo });
            toast.success('Jornada suspendida');
            setIsSuspensionModalOpen(false);
            onRefresh();
        } catch (error) {
            toast.error('Error al suspender jornada');
        } finally {
            setSaving(false);
        }
    };

    const handleReactivarJornada = async () => {
        try {
            await http.patch(`/api/jornadas/${jornada.id}/reactivar`);
            toast.success('Jornada reactivada');
            onRefresh();
        } catch (error) {
            toast.error('Error al reactivar jornada');
        }
    };

    const handleArbitroSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/partidos/${targetPartidoId}/arbitros`, arbitroForm);
            toast.success('Árbitro asignado con éxito');
            setIsArbitroModalOpen(false);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al asignar árbitro');
        } finally {
            setSaving(false);
        }
    };

    const handleDesasignarArbitro = async (partidoId, arbitroId) => {
        if (!window.confirm('¿Deseas remover a este árbitro del encuentro?')) return;
        try {
            await http.delete(`/api/partidos/${partidoId}/arbitros/${arbitroId}`);
            toast.success('Árbitro removido');
            onRefresh();
        } catch (error) {
            toast.error('Error al remover árbitro');
        }
    };

    const handleTogglePago = (pivotId, currentStatus, currentMotivo) => {
        // Al abrir el modal, cargamos los valores actuales para que el usuario pueda verlos o editarlos.
        setPaymentForm({ pivotId, pagado: !!currentStatus, motivo_pago: currentMotivo || '' });
        setIsPagoModalOpen(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/partido-arbitro/${paymentForm.pivotId}/pago`, {
                pagado: paymentForm.pagado,
                motivo_pago: paymentForm.motivo_pago
            });
            toast.success('Estatus de pago actualizado');
            setIsPagoModalOpen(false);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar pago');
        } finally {
            setSaving(false);
        }
    };

    const openResultadoModal = (partido) => {
        setSelectedPartido(partido);
        setResultadoForm({ goles_local: partido.goles_local ?? 0, goles_visitante: partido.goles_visitante ?? 0 });
        setIsResultadoModalOpen(true);
    };

    const handleTogglePagoEquipo = async (partidoId, lado, currentStatus) => {
        try {
            await http.patch(`/api/partidos/${partidoId}/pago-arbitraje`, {
                [`pago_arbitro_${lado}`]: !currentStatus,
                [`pago_arbitro_${lado === 'local' ? 'visitante' : 'local'}`]: !!jornada.partidos.find(p => p.id === partidoId)[`pago_arbitro_${lado === 'local' ? 'visitante' : 'local'}`]
            });
            toast.success(`Pago de equipo ${lado} actualizado`);
            onRefresh();
        } catch (error) {
            toast.error('Error al actualizar pago de equipo');
        }
    };
    // Auto-clear si el equipo seleccionado ya está usado en la jornada
    useEffect(() => {
        if (usedTeamIds.has(partidoForm.equipo_local_id)) {
            setPartidoForm(prev => ({ ...prev, equipo_local_id: '' }));
        }
        if (usedTeamIds.has(partidoForm.equipo_visitante_id)) {
            setPartidoForm(prev => ({ ...prev, equipo_visitante_id: '' }));
        }
    }, [usedTeamIds]);

    return (
        <div>
            {/* ── Header bar ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'none', border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)', padding: '8px 16px',
                        cursor: 'pointer', color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-gold)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                >
                    <ArrowLeft size={16} /> Volver al Listado
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!jornada.cerrada ? (
                        <>
                            {!jornada.suspendida ? (
                                <button
                                    onClick={() => { setMotivo(''); setIsSuspensionModalOpen(true); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700 }}
                                >
                                    <Pause size={14} /> Suspender Jornada
                                </button>
                            ) : (
                                <button
                                    onClick={handleReactivarJornada}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-sage-light)', border: '1px solid rgba(58,107,82,0.15)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', color: 'var(--color-sage)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700 }}
                                >
                                    <Play size={14} /> Reactivar Jornada
                                </button>
                            )}

                            <button
                                onClick={handleCloseJornada}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-terra-light)', border: '1px solid rgba(192,68,42,0.15)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', color: 'var(--color-terra)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                            >
                                <Lock size={14} /> Cerrar Jornada
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleVerResumen}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}
                        >
                            <DollarSign size={14} style={{ color: 'var(--color-gold)' }} /> Ver Resumen Contable
                        </button>
                    )}

                    <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', color: 'var(--color-slate)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}
                    >
                        <Printer size={14} /> Exportar / Imprimir
                    </button>

                    {!jornada.cerrada && !jornada.suspendida && (
                        <GradientButton
                            onClick={() => {
                                setPartidoForm({
                                    equipo_local_id: '',
                                    equipo_visitante_id: '',
                                    cancha_id: '',
                                    cancha_horario_id: '',
                                    arbitro_id: '',
                                    pago_arbitro: parseFloat(torneo.monto_pago_arbitro || 0),
                                    rol: 'Central'
                                });
                                setFormError(null);
                                setIsPartidoModalOpen(true);
                            }}
                            icon={Plus}
                            variant="primary"
                        >
                            Programar Encuentro
                        </GradientButton>
                    )}
                </div>
            </div>

            {/* ── Jornada title card ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                padding: '20px 24px', marginBottom: '24px',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: 'var(--radius-sm)',
                    backgroundColor: jornada.cerrada ? 'var(--color-text-muted)' : jornada.suspendida ? 'var(--color-gold)' : 'var(--color-gold)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '22px', fontFamily: 'var(--font-display)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)', flexShrink: 0
                }}>
                    {jornada.numero}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-slate)', fontFamily: 'var(--font-display)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Jornada {jornada.numero} de Competencia
                        {jornada.cerrada && <span style={{ fontSize: '10px', backgroundColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)', padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase' }}>Finalizada</span>}
                        {jornada.suspendida && <span style={{ fontSize: '10px', backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)', padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suspendida</span>}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Calendar size={13} style={{ color: 'var(--color-gold)' }} />
                        Periodo: {jornada.fecha_inicio} al {jornada.fecha_fin}
                    </div>
                </div>
            </div>

            {/* ── Suspension alert ── */}
            {jornada.suspendida && (
                <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'rgba(212,175,55,0.05)', border: '1px solid var(--color-gold-light)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <AlertCircle style={{ color: 'var(--color-gold)', marginTop: '2px', flexShrink: 0 }} size={20} />
                    <div>
                        <div style={{ fontWeight: 800, color: 'var(--color-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Motivo de Suspensión</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginTop: '4px', fontStyle: 'italic' }}>"{jornada.motivo}"</div>
                    </div>
                </div>
            )}

            {/* ── Match list ── */}
            <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                Rol de Partidos Oficiales
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!jornada.partidos || jornada.partidos.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', fontStyle: 'italic', border: '2px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                        {jornada.suspendida ? 'Esta jornada está suspendida. No se pueden programar partidos.' : 'Sin programación de partidos para esta jornada aún.'}
                    </div>
                ) : (
                    jornada.partidos.map(partido => {
                        // A match is "done" if it's closed, suspended, or has a Jugado/Suspendido estado
                        const esJugado = ['Jugado', 'jugado', 'finalizado', 'Finalizado'].includes(partido.estado?.nombre);
                        const esFinalizado = esJugado || partido.cerrado;
                        const hayEmpate = esFinalizado && Number(partido.goles_local) === Number(partido.goles_visitante);
                        const ganaLocal = esFinalizado && Number(partido.goles_local) > Number(partido.goles_visitante);
                        const ganaVisita = esFinalizado && Number(partido.goles_visitante) > Number(partido.goles_local);

                        const colorLocal = hayEmpate ? '#c9a227' : ganaLocal ? '#2d8653' : 'var(--color-slate)';
                        const colorVisita = hayEmpate ? '#c9a227' : ganaVisita ? '#2d8653' : 'var(--color-slate)';

                        return (
                            <div key={partido.id} style={{
                                backgroundColor: partido.suspendido ? 'rgba(192,68,42,0.03)' : 'var(--color-bg-surface)',
                                borderRadius: 'var(--radius-md)',
                                border: partido.suspendido ? '1px solid rgba(192,68,42,0.2)' : '1px solid var(--color-border-subtle)',
                                boxShadow: 'var(--shadow-soft)',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden'
                            }}>
                                {/* Suspension Banner */}
                                {partido.suspendido && (
                                    <div style={{ padding: '8px 20px', backgroundColor: 'rgba(192,68,42,0.06)', borderBottom: '1px solid rgba(192,68,42,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-terra)', fontWeight: 700 }}>
                                            <AlertCircle size={14} />
                                            Partido Suspendido: <em style={{ fontWeight: 400 }}>"{partido.motivo_suspension}"</em>
                                        </div>
                                        {!jornada.cerrada && !jornada.suspendida && (
                                            <button
                                                onClick={() => handleReactivarPartido(partido.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', color: 'var(--color-sage)', background: 'var(--color-sage-light)', border: '1px solid rgba(58,107,82,0.15)', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                                            >
                                                <Play size={12} /> Reactivar
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Match Row */}
                                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                                    {/* Team Local */}
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            {!jornada.cerrada && !jornada.suspendida && !partido.suspendido && (
                                                <button
                                                    onClick={() => handleTogglePagoEquipo(partido.id, 'local', partido.pago_arbitro_local)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: partido.pago_arbitro_local ? 'var(--color-sage)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                                                    title={partido.pago_arbitro_local ? 'Pago arbitraje local: SI' : '¿Ya pagó local?'}
                                                >
                                                    <DollarSign size={12} strokeWidth={partido.pago_arbitro_local ? 4 : 2} />
                                                </button>
                                            )}
                                            <div style={{ fontWeight: ganaLocal || hayEmpate ? 900 : 700, color: colorLocal, fontSize: '16px', fontFamily: 'var(--font-display)', transition: 'color 0.3s' }}>
                                                {partido.equipo_local?.nombre_mostrado}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Score/VS */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '160px' }}>
                                        {esFinalizado ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    fontSize: '28px', fontWeight: 900,
                                                    backgroundColor: ganaLocal ? 'rgba(45,134,83,0.9)' : hayEmpate ? 'rgba(201,162,39,0.9)' : 'var(--color-slate)',
                                                    color: 'white', padding: '4px 16px', borderRadius: '8px',
                                                    minWidth: '54px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    transition: 'background-color 0.3s'
                                                }}>{partido.goles_local}</div>
                                                <span style={{ color: 'var(--color-gold)', fontWeight: 900, fontSize: '22px' }}>:</span>
                                                <div style={{
                                                    fontSize: '28px', fontWeight: 900,
                                                    backgroundColor: ganaVisita ? 'rgba(45,134,83,0.9)' : hayEmpate ? 'rgba(201,162,39,0.9)' : 'var(--color-slate)',
                                                    color: 'white', padding: '4px 16px', borderRadius: '8px',
                                                    minWidth: '54px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    transition: 'background-color 0.3s'
                                                }}>{partido.goles_visitante}</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                {partido.suspendido ? (
                                                    <div style={{ fontSize: '10px', color: 'var(--color-terra)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}>NO<br />REALIZADO</div>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: '11px', color: 'var(--color-gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>VS</div>
                                                        {partido.fecha && (
                                                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                                                                {partido.fecha.substring(11, 16)} HRS
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <div style={{
                                            marginTop: '10px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '2px 10px', borderRadius: '20px',
                                            backgroundColor: partido.cerrado ? 'var(--color-terra-light)' : partido.suspendido ? 'rgba(192,68,42,0.08)' : esFinalizado ? 'rgba(45,134,83,0.1)' : 'var(--color-border-subtle)',
                                            color: partido.cerrado ? 'var(--color-terra)' : partido.suspendido ? 'var(--color-terra)' : esFinalizado ? '#2d8653' : 'var(--color-text-muted)',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            {partido.cerrado ? 'ACTA CERRADA' : partido.suspendido ? 'SUSPENDIDO' : (partido.estado?.nombre?.toUpperCase() || 'PROGRAMADO')}
                                        </div>
                                        <div style={{ marginTop: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-slate)' }}>📍 {partido.cancha?.nombre || 'Sede por definir'}</div>
                                            {partido.canchaHorario && (
                                                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                                    🕒 {diaSemanaMap[partido.canchaHorario.dia_semana]} - {formatHora(partido.canchaHorario.hora)}
                                                </div>
                                            )}
                                            {(!partido.arbitros || partido.arbitros.length === 0) && (
                                                <div style={{
                                                    marginTop: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: 800,
                                                    color: 'var(--color-terra)',
                                                    backgroundColor: 'var(--color-terra-light)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    textTransform: 'uppercase',
                                                    display: 'inline-block'
                                                }}>
                                                    ⚠️ por asignar árbitro
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Team Visitor */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ fontWeight: ganaVisita || hayEmpate ? 900 : 700, color: colorVisita, fontSize: '16px', fontFamily: 'var(--font-display)', transition: 'color 0.3s' }}>
                                                {partido.equipo_visitante?.nombre_mostrado}
                                            </div>
                                            {!jornada.cerrada && !jornada.suspendida && !partido.suspendido && (
                                                <button
                                                    onClick={() => handleTogglePagoEquipo(partido.id, 'visitante', partido.pago_arbitro_visitante)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: partido.pago_arbitro_visitante ? 'var(--color-sage)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                                                    title={partido.pago_arbitro_visitante ? 'Pago arbitraje visitante: SI' : '¿Ya pagó visita?'}
                                                >
                                                    <DollarSign size={12} strokeWidth={partido.pago_arbitro_visitante ? 4 : 2} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px', minWidth: '100px' }}>
                                        {!partido.cerrado && !jornada.cerrada && !jornada.suspendida && !partido.suspendido && (
                                            <>
                                                <button
                                                    onClick={() => openResultadoModal(partido)}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '7px 12px', color: 'var(--color-sage)', border: '1px solid rgba(58,107,82,0.1)', background: 'var(--color-sage-light)', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                                                    title="Capturar Marcador"
                                                >
                                                    <Trophy size={14} /> <span>Marcador</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const defaultPago = parseFloat(torneo.monto_pago_arbitro || 0);
                                                        setTargetPartidoId(partido.id);
                                                        setArbitroForm({ arbitro_id: '', rol: 'Central', pago: defaultPago });
                                                        setIsArbitroModalOpen(true);
                                                    }}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '7px 12px', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.1)', background: 'var(--color-gold-light)', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                                                    title="Asignar Árbitro"
                                                >
                                                    <Shield size={14} /> <span>Árbitro</span>
                                                 </button>
                                                 {esFinalizado && (
                                                    <button
                                                        onClick={() => handleClosePartido(partido.id)}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '7px 12px', color: 'var(--color-terra)', border: '1px solid rgba(192,68,42,0.1)', background: 'var(--color-terra-light)', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                                                        title="Cerrar Partido (Acta)"
                                                    >
                                                        <Check size={14} /> <span>Cerrar</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { setSuspendPartidoId(partido.id); setMotivoPartido(''); setIsPartidoSuspensionModalOpen(true); }}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '7px 12px', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}
                                                    title="Marcar como No Realizado"
                                                >
                                                    <Pause size={14} /> <span>Suspender</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Referee Section */}
                                {(partido.arbitros && partido.arbitros.length > 0) && (
                                    <div style={{ padding: '12px 24px', backgroundColor: 'var(--color-bg-surface-alt)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Shield size={12} /> Cuerpo Arbitral:
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {partido.arbitros.map(arb => (
                                                <div key={arb.id} style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '6px 10px', backgroundColor: 'var(--color-bg-surface)',
                                                    borderRadius: '8px', border: '1px solid var(--color-border-subtle)',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-slate)' }}>{arb.nombre}</div>
                                                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gold)', backgroundColor: 'var(--color-gold-light)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{arb.pivot.rol}</div>

                                                    {arb.pivot.motivo_pago && (
                                                        <div title={arb.pivot.motivo_pago} style={{ cursor: 'help', color: 'var(--color-terra)', display: 'flex', alignItems: 'center' }}>
                                                            <AlertCircle size={12} />
                                                        </div>
                                                    )}

                                                    {!partido.cerrado && !jornada.cerrada && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px', borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '8px' }}>
                                                            <button
                                                                onClick={() => handleTogglePago(arb.pivot.id, arb.pivot.pagado, arb.pivot.motivo_pago)}
                                                                style={{
                                                                    padding: '4px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                                                    color: arb.pivot.pagado ? 'var(--color-sage)' : 'var(--color-text-muted)',
                                                                    backgroundColor: arb.pivot.pagado ? 'var(--color-sage-light)' : 'transparent',
                                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                                }}
                                                                title={arb.pivot.pagado ? 'Editar pago / Reporte' : 'Registrar pago / Reporte'}
                                                            >
                                                                <DollarSign size={12} />
                                                                {arb.pivot.pagado && <span style={{ fontSize: '9px', fontWeight: 800 }}>PAGADO</span>}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDesasignarArbitro(partido.id, arb.id)}
                                                                style={{ padding: '4px', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', backgroundColor: 'transparent' }}
                                                                title="Remover árbitro"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {(partido.cerrado || jornada.cerrada) && arb.pivot.pagado && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px', color: 'var(--color-sage)' }}>
                                                            <Check size={12} />
                                                            <span style={{ fontSize: '9px', fontWeight: 800 }}>PAGADO</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── Modal: Programar Partido ── */}
            <Modal isOpen={isPartidoModalOpen} onClose={() => setIsPartidoModalOpen(false)} title="Programación de Encuentro" maxWidth="max-w-4xl">
                <form onSubmit={handlePartidoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* ── SECCIÓN 1: DUELO DE ESCUADRAS ── */}
                        <div style={{ 
                            backgroundColor: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '28px', 
                            border: '1px solid var(--color-border-subtle)',
                            boxShadow: 'var(--shadow-soft)',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            gap: '32px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Background decoration */}
                            <div style={{ position: 'absolute', top: '-20px', left: '-20px', opacity: 0.03, pointerEvents: 'none' }}><Users size={120} /></div>
                            
                            {/* Equipo Local */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Shield size={14} /> Anfitrión (Local) <span style={{ color: 'var(--color-terra)' }}>*</span>
                                </label>
                                <select 
                                    style={{ ...inputStyle, padding: '14px 18px', fontSize: '15px', fontWeight: 700 }} 
                                    value={partidoForm.equipo_local_id} 
                                    onChange={e => setPartidoForm({ ...partidoForm, equipo_local_id: e.target.value })} 
                                    required
                                >
                                    <option value="">-- Seleccione equipo --</option>
                                    {equiposInscritos.map(eq => {
                                        const isOpponent = eq.id === partidoForm.equipo_visitante_id;
                                        const isUsed = usedTeamIds.has(eq.id);
                                        return (
                                            <option key={eq.id} value={eq.id} disabled={isOpponent || isUsed}>
                                                {eq.nombre_mostrado}{isUsed ? ' (ya usado)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* VS Badge */}
                            <div style={{ 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                                backgroundColor: 'white', border: '2px solid var(--color-gold)', borderRadius: '50%', 
                                width: '48px', height: '48px', z_index: 2, boxShadow: 'var(--shadow-md)',
                                marginTop: '22px'
                            }}>
                                <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-gold)', letterSpacing: '1px' }}>VS</span>
                            </div>

                            {/* Equipo Visitante */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Shield size={14} /> Visitante <span style={{ color: 'var(--color-terra)' }}>*</span>
                                </label>
                                <select 
                                    style={{ ...inputStyle, padding: '14px 18px', fontSize: '15px', fontWeight: 700 }} 
                                    value={partidoForm.equipo_visitante_id} 
                                    onChange={e => setPartidoForm({ ...partidoForm, equipo_visitante_id: e.target.value })} 
                                    required
                                >
                                    <option value="">-- Seleccione equipo --</option>
                                    {equiposInscritos.map(eq => {
                                        const isOpponent = eq.id === partidoForm.equipo_local_id;
                                        const isUsed = usedTeamIds.has(eq.id);
                                        return (
                                            <option key={eq.id} value={eq.id} disabled={isOpponent || isUsed}>
                                                {eq.nombre_mostrado}{isUsed ? ' (ya usado)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* ── SECCIÓN 2: LOGÍSTICA (SEDE Y HORARIO) ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <MapPin size={14} style={{ color: 'var(--color-gold)' }} /> Sede del Encuentro
                                </label>
                                <select style={{ ...inputStyle, padding: '12px 14px' }} value={partidoForm.cancha_id} onChange={e => {
                                    const value = e.target.value;
                                    setPartidoForm(prev => {
                                        let nuevoHorarioId = '';
                                        if (value && selectedLocalForm && value === selectedLocalForm.cancha_id) nuevoHorarioId = selectedLocalForm.cancha_horario_id || '';
                                        else if (value && selectedVisitForm && value === selectedVisitForm.cancha_id) nuevoHorarioId = selectedVisitForm.cancha_horario_id || '';
                                        return { ...prev, cancha_id: value, cancha_horario_id: nuevoHorarioId };
                                    });
                                }}>
                                    <option value="">-- Seleccione una sede --</option>
                                    {selectedLocalForm?.cancha && <option value={selectedLocalForm.cancha_id}>Sede Local ({selectedLocalForm.cancha.nombre})</option>}
                                    {selectedVisitForm?.cancha && <option value={selectedVisitForm.cancha_id} disabled={selectedLocalForm?.cancha_id === selectedVisitForm.cancha_id}>Sede Visitante ({selectedVisitForm.cancha.nombre})</option>}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Clock size={14} style={{ color: 'var(--color-gold)' }} /> Horario de Inicio
                                </label>
                                {(() => {
                                    const ownerEquipo = partidoForm.cancha_id
                                        ? ([selectedLocalForm, selectedVisitForm].find(eq => eq?.cancha_id === partidoForm.cancha_id))
                                        : null;
                                    const horarios = ownerEquipo?.cancha?.horarios ?? [];
                                    const habitualId = ownerEquipo?.cancha_horario_id ?? null;
                                    const filtered = horarios.filter(h =>
                                        !torneo.dias_juego || torneo.dias_juego.length === 0 || torneo.dias_juego.includes(h.dia_semana)
                                    );
                                    return (
                                        <select
                                            style={{ ...inputStyle, padding: '12px 14px' }}
                                            value={partidoForm.cancha_horario_id}
                                            onChange={e => setPartidoForm({ ...partidoForm, cancha_horario_id: e.target.value })}
                                            disabled={!partidoForm.cancha_id}
                                        >
                                            <option value="">-- Seleccione un horario --</option>
                                            {filtered.map(h => (
                                                <option key={h.id} value={h.id}>
                                                    {diaSemanaMap[h.dia_semana]} - {formatHora(h.hora)} {h.id === habitualId ? '(Habitual)' : ''}
                                                </option>
                                            ))}
                                            {filtered.length === 0 && partidoForm.cancha_id && (
                                                <option disabled value="">Sin horarios disponibles</option>
                                            )}
                                        </select>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* ── SECCIÓN 3: CUERPO ARBITRAL (OPCIONAL) ── */}
                        <div style={{ 
                            padding: '24px', 
                            backgroundColor: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-md)', 
                            border: '1px solid var(--color-border-subtle)',
                            marginTop: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>
                                <User size={14} /> Asignación de Árbitros (Opcional)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Nombre del Árbitro</label>
                                    <select
                                        style={inputStyle}
                                        value={partidoForm.arbitro_id}
                                        onChange={e => setPartidoForm({ ...partidoForm, arbitro_id: e.target.value })}
                                    >
                                        <option value="">-- Sin asignar —-</option>
                                        {arbitrosCatalog.map(arb => (
                                            <option key={arb.id} value={arb.id}>{arb.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Rol Principal</label>
                                    <select
                                        style={inputStyle}
                                        value={partidoForm.rol}
                                        onChange={e => setPartidoForm({ ...partidoForm, rol: e.target.value })}
                                        disabled={!partidoForm.arbitro_id}
                                    >
                                        <option value="Central">Central</option>
                                        <option value="Asistente 1">Asistente 1</option>
                                        <option value="Asistente 2">Asistente 2</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Pago Árbitro ($)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            style={{ ...inputStyle, backgroundColor: '#f8fafc', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
                                            value={partidoForm.pago_arbitro || parseFloat(torneo.monto_pago_arbitro || 0)}
                                            disabled={true}
                                        />
                                        <div title="Monto inmutable definido en el torneo" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }}><Lock size={12} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PIE DE FORMULARIO ESTÁTICO */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        {formError && (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-terra)', backgroundColor: 'var(--color-terra-light)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,68,42,0.2)', fontSize: '13px', fontWeight: 700 }}>
                                <AlertCircle size={16} />
                                {formError}
                            </div>
                        )}
                        <button 
                            type="button" 
                            onClick={() => { setIsPartidoModalOpen(false); setFormError(null); }} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Programar Encuentro Oficial</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Resultado ── */}
            <Modal isOpen={isResultadoModalOpen} onClose={() => setIsResultadoModalOpen(false)} title="Acta de Resultados Oficiales">
                {selectedPartido && (
                    <form onSubmit={handleResultadoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* ── ENCABEZADO DE ENCUENTRO ── */}
                        <div style={{ 
                            padding: '28px', 
                            backgroundColor: 'var(--color-bg-surface-alt)', 
                            borderRadius: 'var(--radius-lg)', 
                            border: '1px solid var(--color-border-subtle)', 
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                             <div style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.05 }}><Trophy size={80} /></div>
                            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '2px' }}>Marcador Final Oficial</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-slate)', fontSize: '22px', marginBottom: '4px', lineHeight: 1.1 }}>{selectedPartido.equipo_local?.nombre_mostrado}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '1px' }}>LOCAL</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-gold)', boxShadow: 'var(--shadow-md)' }}>
                                    <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--color-slate)', fontFamily: 'var(--font-display)' }}>{resultadoForm.goles_local}</span>
                                    <span style={{ color: 'var(--color-gold)', fontWeight: 900, fontSize: '20px' }}>—</span>
                                    <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--color-slate)', fontFamily: 'var(--font-display)' }}>{resultadoForm.goles_visitante}</span>
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-slate)', fontSize: '22px', marginBottom: '4px', lineHeight: 1.1 }}>{selectedPartido.equipo_visitante?.nombre_mostrado}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-gold)', fontWeight: 800, letterSpacing: '1px' }}>VISITANTE</div>
                                </div>
                            </div>
                        </div>

                        {/* ── CAPTURA DE GOLES ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Trophy size={14} style={{ color: 'var(--color-primary)' }} /> Goles del Local
                                </label>
                                <input
                                    type="number" min="0"
                                    style={{ ...inputStyle, fontSize: '24px', fontWeight: 900, textAlign: 'center', padding: '16px' }}
                                    value={resultadoForm.goles_local}
                                    onChange={e => setResultadoForm({ ...resultadoForm, goles_local: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }} >
                                    <Trophy size={14} style={{ color: 'var(--color-gold)' }} /> Goles del Visitante
                                </label>
                                <input
                                    type="number" min="0"
                                    style={{ ...inputStyle, fontSize: '24px', fontWeight: 900, textAlign: 'center', padding: '16px' }}
                                    value={resultadoForm.goles_visitante}
                                    onChange={e => setResultadoForm({ ...resultadoForm, goles_visitante: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* ── OBSERVACIONES ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <FileText size={14} style={{ color: 'var(--color-gold)' }} /> Observaciones de la Cédula
                            </label>
                            <textarea
                                style={{ ...inputStyle, height: '120px', resize: 'none', padding: '16px', fontSize: '14px', lineHeight: '1.5' }}
                                placeholder="Registra incidencias, amonestaciones o cualquier situación relevante para el acta oficial..."
                                value={resultadoForm.observaciones}
                                onChange={e => setResultadoForm({ ...resultadoForm, observaciones: e.target.value })}
                            />
                        </div>

                        {/* ACCIONES */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                            <button 
                                type="button" 
                                onClick={() => setIsResultadoModalOpen(false)} 
                                style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                            >
                                Cancelar
                            </button>
                            <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Guardar Acta Oficial</GradientButton>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ── Modal: Suspensión ── */}
            <Modal isOpen={isSuspensionModalOpen} onClose={() => setIsSuspensionModalOpen(false)} title="Suspensión de Jornada Oficial">
                <form onSubmit={handleSuspenderJornada} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ padding: '20px', backgroundColor: 'rgba(192,68,42,0.05)', border: '1px solid rgba(192,68,42,0.15)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <AlertTriangle size={24} style={{ color: 'var(--color-terra)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-terra)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Atención Administrador</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5', fontWeight: 500 }}>
                                Estás a punto de suspender la jornada completa. Los encuentros programados no sumarán estadísticas y se notificará a los delegados.
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} style={{ color: 'var(--color-gold)' }} /> Motivo de la Suspensión
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '120px', resize: 'none', padding: '16px' }}
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            placeholder="Ej. Condiciones climatológicas adversas, falta de disponibilidad de sedes, duelo oficial..."
                            required
                        />
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', paddingLeft: '4px' }}>Esta justificación será visible en el calendario para todos los usuarios.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '4px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsSuspensionModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Confirmar Suspensión</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Suspender Partido ── */}
            <Modal isOpen={isPartidoSuspensionModalOpen} onClose={() => setIsPartidoSuspensionModalOpen(false)} title="Anulación de Encuentro Deportivo">
                <form onSubmit={handleSuspenderPartido} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ padding: '20px', backgroundColor: 'rgba(192,68,42,0.05)', border: '1px solid rgba(192,68,42,0.15)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <AlertCircle size={24} style={{ color: 'var(--color-terra)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-terra)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Protocolo de Incidencia</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5', fontWeight: 500 }}>
                                El partido quedará marcado como <strong style={{ color: 'var(--color-terra)' }}>Suspendido</strong>. Podrás reactivarlo posteriormente si la situación se resuelve administrativamente.
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} style={{ color: 'var(--color-gold)' }} /> Razón de No Realización
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '120px', resize: 'none', padding: '16px' }}
                            value={motivoPartido}
                            onChange={e => setMotivoPartido(e.target.value)}
                            placeholder="Ej. Incomparecencia de equipo (Default), falla en suministro eléctrico, conducta antideportiva..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '4px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsPartidoSuspensionModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Volver
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Confirmar Suspensión</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Cierre de Jornada (Summary) ── */}
            <Modal isOpen={isCierreModalOpen} onClose={() => setIsCierreModalOpen(false)} title={`Resumen de Jornada ${jornada.numero}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {pendingList.length > 0 ? (
                        <>
                            <div style={{ padding: '24px', backgroundColor: 'rgba(192,68,42,0.05)', border: '1px solid rgba(192,68,42,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ fontWeight: 900, color: 'var(--color-terra)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    <AlertCircle size={20} /> Bloqueo de Cierre de Jornada
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: '1.5' }}>
                                    No es posible finalizar la jornada oficial ya que existen los siguientes encuentros sin concluir o sin acta oficial:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,68,42,0.1)' }}>
                                    {pendingList.map((p, i) => (
                                        <div key={i} style={{ fontSize: '13px', color: 'var(--color-slate)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-terra)' }}></div>
                                            {typeof p === 'string' ? p : `${p.equipo_local?.nombre_mostrado ?? '?'} vs ${p.equipo_visitante?.nombre_mostrado ?? '?'}`}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    Asegúrate de registrar todos los resultados o marcar los partidos como suspendidos antes de proceder al corte contable.
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                                <button 
                                    onClick={() => setIsCierreModalOpen(false)} 
                                    style={{ padding: '12px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                                >
                                    Entendido
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', backgroundColor: 'rgba(45,134,83,0.05)', border: '1px solid rgba(45,134,83,0.15)', borderRadius: 'var(--radius-lg)' }}>
                                <CheckCircle size={20} style={{ color: 'var(--color-sage)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-sage)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Protocolo de cierre habilitado: Todos los encuentros concluidos
                                </span>
                            </div>

                            {/* ── SECCIÓN FINANCIERA: CARDS ── */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                <div style={{ background: 'var(--color-bg-surface-alt)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ingresos Reales</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-sage)' }}>${summaryData.totalCobrado.toLocaleString()}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>MXN</span>
                                    </div>
                                    <TrendingUp size={16} style={{ color: 'var(--color-sage)', opacity: 0.5, marginTop: '4px' }} />
                                </div>

                                <div style={{ background: 'var(--color-bg-surface-alt)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Egresos Totales</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-terra)' }}>${((jornadaResumen?.egresos?.reduce((acc, e) => acc + parseFloat(e.monto), 0)) || summaryData.totalEgresosArbitros).toLocaleString()}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>MXN</span>
                                    </div>
                                    <TrendingDown size={16} style={{ color: 'var(--color-terra)', opacity: 0.5, marginTop: '4px' }} />
                                </div>

                                <div style={{ background: 'var(--color-navy)', padding: '20px', borderRadius: 'var(--radius-lg)', border: 'none', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 20px rgba(10, 25, 47, 0.15)' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Utilidad Neta</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-gold)' }}>
                                            ${(summaryData.totalCobrado - ((jornadaResumen?.egresos?.reduce((acc, e) => acc + parseFloat(e.monto), 0)) || summaryData.totalEgresosArbitros)).toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>MXN</span>
                                    </div>
                                    <Activity size={16} style={{ color: 'var(--color-gold)', opacity: 0.5, marginTop: '4px' }} />
                                </div>
                            </div>

                            {/* ── DETALLE DE PAGOS A ÁRBITROS ── */}
                            {jornadaResumen?.detalles_arbitraje?.length > 0 && (
                                <div style={{ marginTop: '-4px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={14} /> Liquidación de Honorarios Arbitrales
                                    </div>
                                    <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: 'var(--color-bg-surface-alt)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                                                    <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Oficial</th>
                                                    <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Rol</th>
                                                    <th style={{ textAlign: 'right', padding: '12px 20px', fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jornadaResumen.detalles_arbitraje.map((det, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-bg-surface-alt)' }}>
                                                        <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--color-slate)' }}>{det.arbitro_nombre}</td>
                                                        <td style={{ padding: '12px 20px' }}>
                                                            <span style={{ fontSize: '10px', padding: '2px 8px', background: 'var(--color-gold-light)', color: 'var(--color-gold)', borderRadius: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{det.rol}</span>
                                                        </td>
                                                        <td style={{ padding: '12px 20px', textAlign: 'right', fontSize: '14px', fontWeight: 900, color: 'var(--color-terra)' }}>${parseFloat(det.monto).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ── OTROS GASTOS ── */}
                            {jornadaResumen?.egresos?.filter(e => e.categoria !== 'arbitraje').length > 0 && (
                                <div style={{ marginTop: '-4px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={14} /> Egresos Operativos Adicionales
                                    </div>
                                    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
                                        {jornadaResumen.egresos.filter(e => e.categoria !== 'arbitraje').map((egr, idx) => (
                                            <div key={idx} style={{ padding: '12px 20px', borderBottom: idx === (jornadaResumen.egresos.filter(e => e.categoria !== 'arbitraje').length - 1) ? 'none' : '1px solid var(--color-bg-surface-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-slate)' }}>{egr.concepto}</span>
                                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{egr.categoria}</span>
                                                </div>
                                                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-terra)' }}>-${parseFloat(egr.monto).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── RESULTADOS DEPORTIVOS ── */}
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={14} /> Marcadores Registrados
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(jornada.partidos || []).map(partido => {
                                        const esJugado = ['Jugado', 'jugado', 'finalizado'].includes(partido.estado?.nombre) || partido.cerrado;
                                        const gL = Number(partido.goles_local);
                                        const gV = Number(partido.goles_visitante);
                                        const ganaLocal = esJugado && gL > gV;
                                        const ganaVisita = esJugado && gV > gL;
                                        const empate = esJugado && gL === gV;
                                        return (
                                            <div key={partido.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', gap: '16px' }}>
                                                <div style={{ flex: 1, textAlign: 'right', fontWeight: ganaLocal ? 800 : 600, color: ganaLocal ? 'var(--color-sage)' : 'var(--color-slate)', fontSize: '14px' }}>{partido.equipo_local?.nombre_mostrado}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px', justifyContent: 'center', padding: '4px 12px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                                                    {partido.suspendido ? (
                                                        <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-terra)', textTransform: 'uppercase' }}>Suspendido</span>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontWeight: 900, fontSize: '20px', color: ganaLocal ? 'var(--color-sage)' : 'var(--color-slate)' }}>{partido.goles_local}</span>
                                                            <span style={{ color: 'var(--color-border-subtle)', fontWeight: 900 }}>-</span>
                                                            <span style={{ fontWeight: 900, fontSize: '20px', color: ganaVisita ? 'var(--color-sage)' : 'var(--color-slate)' }}>{partido.goles_visitante}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, fontWeight: ganaVisita ? 800 : 600, color: ganaVisita ? 'var(--color-sage)' : 'var(--color-slate)', fontSize: '14px' }}>{partido.equipo_visitante?.nombre_mostrado}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)' }}>
                                <button 
                                    onClick={() => setIsCierreModalOpen(false)} 
                                    style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                                >
                                    Cerrar Vista
                                </button>
                                {!jornada.cerrada && (
                                    <GradientButton onClick={handleConfirmCierre} disabled={saving} isLoading={saving} variant="primary" style={{ padding: '12px 40px' }}>
                                        Confirmar Cierre de Jornada
                                    </GradientButton>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* ── Modal: Asignar Árbitro ── */}
            <Modal isOpen={isArbitroModalOpen} onClose={() => setIsArbitroModalOpen(false)} title="Asignación de Cuerpo Arbitral">
                <form onSubmit={handleArbitroSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ 
                        backgroundColor: 'var(--color-bg-surface-alt)', 
                        padding: '24px', 
                        borderRadius: 'var(--radius-lg)', 
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <User size={14} style={{ color: 'var(--color-gold)' }} /> Seleccionar Árbitro Oficial
                            </label>
                            <select
                                style={{ ...inputStyle, padding: '14px' }}
                                value={arbitroForm.arbitro_id}
                                onChange={e => setArbitroForm({ ...arbitroForm, arbitro_id: e.target.value })}
                                required
                            >
                                <option value="">-- Seleccione un oficial --</option>
                                {arbitrosCatalog.map(arb => (
                                    <option key={arb.id} value={arb.id}>{arb.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Shield size={14} style={{ color: 'var(--color-gold)' }} /> Rol en el Encuentro
                                </label>
                                <select 
                                    style={inputStyle}
                                    value={arbitroForm.rol}
                                    onChange={e => setArbitroForm({ ...arbitroForm, rol: e.target.value })}
                                    required
                                >
                                    <option value="Central">Central (Principal)</option>
                                    <option value="Asistente 1">Asistente 1</option>
                                    <option value="Asistente 2">Asistente 2</option>
                                    <option value="Cuarto Árbitro">Cuarto Árbitro</option>
                                    <option value="Anotador">Anotador</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Banknote size={14} style={{ color: 'var(--color-gold)' }} /> Pago Acordado $
                                </label>
                                <input 
                                    type="number"
                                    style={inputStyle}
                                    value={arbitroForm.pago}
                                    onChange={e => setArbitroForm({ ...arbitroForm, pago: e.target.value })}
                                    required
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsArbitroModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Confirmar Asignación</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Pago de Arbitraje / Reporte ── */}
            <Modal isOpen={isPagoModalOpen} onClose={() => setIsPagoModalOpen(false)} title="Seguimiento de Pago de Arbitraje">
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                            <Banknote size={14} /> Estatus de la Transacción
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div 
                                onClick={() => setPaymentForm({ ...paymentForm, pagado: true })}
                                style={{ 
                                    padding: '16px', 
                                    borderRadius: 'var(--radius-md)', 
                                    border: `1px solid ${paymentForm.pagado ? 'var(--color-sage)' : 'var(--color-border-subtle)'}`,
                                    backgroundColor: paymentForm.pagado ? 'rgba(45,134,83,0.05)' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <CheckCircle size={24} style={{ color: paymentForm.pagado ? 'var(--color-sage)' : 'var(--color-text-muted)' }} />
                                <span style={{ fontSize: '13px', fontWeight: 800, color: paymentForm.pagado ? 'var(--color-sage)' : 'var(--color-text-primary)' }}>Pago Efectuado</span>
                            </div>

                            <div 
                                onClick={() => setPaymentForm({ ...paymentForm, pagado: false })}
                                style={{ 
                                    padding: '16px', 
                                    borderRadius: 'var(--radius-md)', 
                                    border: `1px solid ${!paymentForm.pagado ? 'var(--color-terra)' : 'var(--color-border-subtle)'}`,
                                    backgroundColor: !paymentForm.pagado ? 'rgba(192,68,42,0.05)' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <XCircle size={24} style={{ color: !paymentForm.pagado ? 'var(--color-terra)' : 'var(--color-text-muted)' }} />
                                <span style={{ fontSize: '13px', fontWeight: 800, color: !paymentForm.pagado ? 'var(--color-terra)' : 'var(--color-text-primary)' }}>Sin Pago Realizado</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} style={{ color: 'var(--color-gold)' }} /> Observaciones Contables
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '120px', resize: 'none', padding: '16px' }}
                            value={paymentForm.motivo_pago}
                            onChange={e => setPaymentForm({ ...paymentForm, motivo_pago: e.target.value })}
                            placeholder="Registra cualquier incidencia, deducción o motivo por el cual no se liquidó el monto completo..."
                        />
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', paddingLeft: '4px' }}>Este reporte quedará vinculado al historial financiero de la jornada.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '4px', paddingTop: '24px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsPagoModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary">Guardar Estatus</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Preview & Export PDF ── */}
            <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Vista Previa - PDF Rol de Juego" maxWidth="max-w-5xl">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <GradientButton onClick={handlePrint} icon={Printer} variant="primary">
                        Imprimir / Guardar como PDF
                    </GradientButton>
                </div>
                <div style={{ 
                    maxHeight: '65vh', 
                    overflowY: 'auto', 
                    border: '1px solid var(--color-border-subtle)', 
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#e9ecef', /* Background for preview area */
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.1)', background: 'white' }}>
                        <JornadaPDFExport ref={pdfRef} jornada={jornada} torneo={torneo} />
                    </div>
                </div>
            </Modal>

        </div>
    );
}

// ────────────────────────────────────────────────
// Main Component: Jornadas list
// ────────────────────────────────────────────────
export default function JornadasManager({ torneo }) {
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJornadaId, setSelectedJornadaId] = useState(null);

    const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
    const [jornadaForm, setJornadaForm] = useState({ numero: '', fecha_inicio: '', fecha_fin: '' });
    const [equiposInscritos, setEquiposInscritos] = useState([]);
    const [saving, setSaving] = useState(false);

    const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
    const [suspensionData, setSuspensionData] = useState({ jornadaId: null, motivo: '' });

    const fetchJornadas = async () => {
        setLoading(true);
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/jornadas`);
            setJornadas(response.data);
        } catch (error) {
            toast.error('Error al cargar jornadas');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquiposInscritos = async () => {
        try {
            const response = await http.get(`/api/torneos/${torneo.id}/equipos-inscritos`);
            setEquiposInscritos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchJornadas();
        fetchEquiposInscritos();
    }, [torneo.id]);

    const handleJornadaSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.post(`/api/torneos/${torneo.id}/jornadas`, jornadaForm);
            toast.success('Jornada creada con éxito');
            setIsJornadaModalOpen(false);
            setJornadaForm({ numero: '', fecha_inicio: '', fecha_fin: '' });
            fetchJornadas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la jornada');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteJornada = async (e, jornadaId) => {
        e.stopPropagation();
        if (!window.confirm('¿Deseas eliminar esta jornada?')) return;
        try {
            await http.delete(`/api/jornadas/${jornadaId}`);
            toast.success('Jornada eliminada');
            fetchJornadas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar jornada');
        }
    };

    const handleSuspenderJornada = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await http.patch(`/api/jornadas/${suspensionData.jornadaId}/suspender`, { motivo: suspensionData.motivo });
            toast.success('Jornada suspendida');
            setIsSuspensionModalOpen(false);
            setSuspensionData({ jornadaId: null, motivo: '' });
            fetchJornadas();
        } catch (error) {
            toast.error('Error al suspender jornada');
        } finally {
            setSaving(false);
        }
    };

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

    const nextNum = jornadas.length > 0 ? Math.max(...jornadas.map(j => j.numero)) + 1 : 1;

    const openCrearJornada = () => {
        let suggestedStart = '';
        if (jornadas.length === 0) {
            suggestedStart = torneo.fecha_inicio ? String(torneo.fecha_inicio).split('T')[0] : new Date().toISOString().split('T')[0];
        } else {
            const lastJ = jornadas.reduce((max, j) => j.numero > max.numero ? j : max, jornadas[0]);
            const d = new Date(lastJ.fecha_fin);
            d.setDate(d.getDate() + 1);
            suggestedStart = d.toISOString().split('T')[0];
        }
        const endD = new Date(suggestedStart);
        endD.setDate(endD.getDate() + 6);
        setJornadaForm({ numero: nextNum, fecha_inicio: suggestedStart, fecha_fin: endD.toISOString().split('T')[0] });
        setIsJornadaModalOpen(true);
    };

    // ── Status badge helper ──
    const StatusBadge = ({ jornada }) => {
        if (jornada.cerrada) return <span style={{ fontSize: '10px', backgroundColor: 'var(--color-slate-light)', color: 'var(--color-slate)', padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 800 }}>Finalizada</span>;
        if (jornada.suspendida) return <span style={{ fontSize: '10px', backgroundColor: 'var(--color-terra-light)', color: 'var(--color-terra)', padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 800 }}>Suspendida</span>;
        return <span style={{ fontSize: '10px', backgroundColor: 'rgba(58,107,82,0.12)', color: 'var(--color-sage)', padding: '3px 10px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 800 }}>En Curso</span>;
    };

    // ── Detail‑view is active ──
    const selectedJornadaData = jornadas.find(j => j.id === selectedJornadaId);

    if (selectedJornadaData) {
        return (
            <Card title={`Torneo · ${torneo.nombre}`}>
                <JornadaDetail
                    jornada={selectedJornadaData}
                    torneo={torneo}
                    equiposInscritos={equiposInscritos}
                    onBack={() => setSelectedJornadaId(null)}
                    onRefresh={fetchJornadas}
                />
            </Card>
        );
    }

    // ── List view ──
    return (
        <Card title="Calendario y Organización de Jornadas">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', width: '100%', minWidth: '800px' }}>
                <GradientButton onClick={openCrearJornada} icon={Plus} variant="primary">
                    Crear Jornada {nextNum}
                </GradientButton>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic', width: '100%', minWidth: '800px' }}>Cargando jornadas oficiales...</div>
            ) : jornadas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', width: '100%', minWidth: '800px' }}>
                    No se han generado jornadas para este torneo todavía.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', minWidth: '800px' }}>
                    {jornadas.map(jornada => (
                        <div
                            key={jornada.id}
                            onClick={() => setSelectedJornadaId(jornada.id)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '18px 24px',
                                backgroundColor: 'var(--color-bg-surface)',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-soft)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                gap: '16px',
                                width: '100%',
                                minWidth: '800px'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
                        >
                            {/* Number badge */}
                            <div style={{
                                width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
                                backgroundColor: jornada.cerrada ? 'var(--color-slate)' : jornada.suspendida ? 'var(--color-terra)' : 'var(--color-gold)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: '18px', fontFamily: 'var(--font-display)',
                                flexShrink: 0, boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}>{jornada.numero}</div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: 'var(--color-slate)', fontFamily: 'var(--font-display)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Jornada {jornada.numero} de Competencia
                                    <StatusBadge jornada={jornada} />
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                    <Calendar size={11} style={{ color: 'var(--color-gold)' }} />
                                    {jornada.fecha_inicio} — {jornada.fecha_fin}
                                    <span style={{ marginLeft: '8px', color: 'var(--color-border-subtle)' }}>|</span>
                                    <span>{jornada.partidos?.length ?? 0} partido(s)</span>
                                </div>
                                {jornada.suspendida && jornada.motivo && (
                                    <div style={{ fontSize: '11px', color: 'var(--color-gold)', fontStyle: 'italic', marginTop: '4px' }}>⚠ "{jornada.motivo}"</div>
                                )}
                            </div>

                            {/* Quick actions (stop propagation) */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                                {!jornada.cerrada && (
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDeleteJornada(e, jornada.id); }}
                                        style={{ padding: '6px', color: 'var(--color-terra)', background: 'var(--color-terra-light)', border: '1px solid rgba(192,68,42,0.15)', borderRadius: '6px', cursor: 'pointer' }}
                                        title="Eliminar Jornada"
                                    ><Trash2 size={15} /></button>
                                )}
                            </div>

                            <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                Ver detalle →
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Modal: Crear Jornada ── */}
            <Modal isOpen={isJornadaModalOpen} onClose={() => setIsJornadaModalOpen(false)} title="Aperturar Nueva Jornada">
                <form onSubmit={handleJornadaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', textAlign: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '20px', opacity: 0.1 }}><PlusCircle size={64} /></div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1.5px' }}>Siguiente Secuencia Oficial</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}>Jornada No. {jornadaForm.numero}</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <Calendar size={14} style={{ color: 'var(--color-gold)' }} /> Inicio de Jornada
                            </label>
                            <input 
                                type="date" 
                                style={{ ...inputStyle, padding: '14px' }} 
                                value={jornadaForm.fecha_inicio} 
                                onChange={e => setJornadaForm({ ...jornadaForm, fecha_inicio: e.target.value })} 
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <Calendar size={14} style={{ color: 'var(--color-gold)' }} /> Cierre de Jornada
                            </label>
                            <input 
                                type="date" 
                                style={{ ...inputStyle, padding: '14px' }} 
                                value={jornadaForm.fecha_fin} 
                                onChange={e => setJornadaForm({ ...jornadaForm, fecha_fin: e.target.value })} 
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '4px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsJornadaModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary" style={{ padding: '12px 32px' }}>Aperturar Jornada</GradientButton>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Suspender desde lista ── */}
            <Modal isOpen={isSuspensionModalOpen} onClose={() => setIsSuspensionModalOpen(false)} title="Suspensión de Jornada Oficial">
                <form onSubmit={handleSuspenderJornada} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ padding: '20px', backgroundColor: 'rgba(192,68,42,0.05)', border: '1px solid rgba(192,68,42,0.15)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <AlertTriangle size={24} style={{ color: 'var(--color-terra)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-terra)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acción Administrativa</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5', fontWeight: 500 }}>
                                Estás a punto de suspender esta jornada. Esta acción afectará la programación y visibilidad de los encuentros para todos los equipos.
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} style={{ color: 'var(--color-gold)' }} /> Justificación de la Suspensión
                        </label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '120px', resize: 'none', padding: '16px' }}
                            value={suspensionData.motivo}
                            onChange={e => setSuspensionData({ ...suspensionData, motivo: e.target.value })}
                            placeholder="Describe detalladamente el motivo de la suspensión (clima, logística, seguridad, etc.)..."
                            required
                        />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '4px', paddingTop: '28px', borderTop: '1px solid var(--color-border-subtle)' }}>
                        <button 
                            type="button" 
                            onClick={() => setIsSuspensionModalOpen(false)} 
                            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: 'none' }}
                        >
                            Cancelar
                        </button>
                        <GradientButton type="submit" disabled={saving} isLoading={saving} variant="primary" style={{ padding: '12px 32px' }}>Confirmar Suspensión</GradientButton>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}
