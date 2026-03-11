import React, { useRef } from 'react';
import { BookOpen, AlertCircle, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ReglamentoDocumento from './ReglamentoDocumento';

export default function ReglamentoWidget() {
    // Referencia al componente oculto que se imprimirá/descargará
    const componentRef = useRef(null);

    // Hook de react-to-print
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Reglamento_Liga_Santiago_Zapotitlan_2025',
    });

    return (
        <div
            className="card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-medium)',
            }}
        >
            {/* Header del widget */}
            <div
                style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--color-bg-surface-alt)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-slate-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-slate)',
                        }}
                    >
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <div className="text-label" style={{ marginBottom: 2 }}>
                            Documento Oficial
                        </div>
                        <h3
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 18,
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                                lineHeight: 1,
                            }}
                        >
                            Reglamento de Competencia
                        </h3>
                    </div>
                </div>
            </div>

            {/* Resumen Estático Siempre Visible */}
            <div style={{ padding: '24px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '16px',
                        background: 'var(--color-gold-light)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(160, 120, 40, 0.2)',
                        marginBottom: 20,
                    }}
                >
                    <AlertCircle size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: 2 }} />
                    <p
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.5,
                        }}
                    >
                        <strong>Actualización importante:</strong> Para la temporada Clausura 2026, las amonestaciones acumuladas se reiniciarán en la fase de liguilla. Revisa el artículo 14.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { title: 'Art. 12 - Faltas y Sanciones', desc: 'Tabla de penalizaciones por tarjeta roja directa.' },
                        { title: 'Art. 18 - Registro de Jugadores', desc: 'Fechas límite para altas y bajas en la plantilla.' },
                        { title: 'Art. 22 - Uniformes', desc: 'Requerimientos obligatorios de dorsales y colores.' },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '12px 16px',
                                border: '1px solid var(--color-border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'var(--color-bg-surface-alt)',
                            }}
                        >
                            <div>
                                <h4
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 2,
                                    }}
                                >
                                    {item.title}
                                </h4>
                                <p
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: 12,
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePrint}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        marginTop: 20,
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <Download size={16} /> Descargar PDF Completo
                </button>
            </div>

            {/* Aquí inyectamos el documento oculto. La referencia permite interactuar para la impresión */}
            <ReglamentoDocumento ref={componentRef} />
        </div>
    );
}
