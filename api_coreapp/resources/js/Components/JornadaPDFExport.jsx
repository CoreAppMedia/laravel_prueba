import React, { forwardRef } from 'react';

const JornadaPDFExport = forwardRef(({ jornada, torneo }, ref) => {
    // Carta size dimensions for print: 8.5in x 11in
    // We use standard CSS to force the print size
    
    if (!jornada) return null;

    const partidos = jornada.partidos || [];
    
    // Group matches by field (cancha) to make the schedule easier to read
    const partidosPorCancha = partidos.reduce((acc, partido) => {
        const cancha = partido.cancha?.nombre || 'Sede por definir';
        if (!acc[cancha]) {
            acc[cancha] = [];
        }
        acc[cancha].push(partido);
        return acc;
    }, {});

    const diaSemanaMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

    const formatHora = (t) => (typeof t === 'string' ? t.substring(0, 5) + ' hrs' : 'TBD');

    return (
        <div ref={ref} className="pdf-export-container bg-white text-black font-body">
            <style>
                {`
                    @media print {
                        @page {
                            size: letter;
                            margin: 10mm;
                        }
                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            background-color: white !important;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                        .no-break {
                            page-break-inside: avoid;
                        }
                    }
                    .pdf-export-container {
                        width: 100%;
                        max-width: 215.9mm; /* Carta width */
                        margin: 0 auto;
                        padding: 10mm;
                        background: white;
                        color: #111;
                    }
                    .pdf-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-bottom: 3px solid var(--color-gold, #A07828);
                        padding-bottom: 16px;
                        margin-bottom: 24px;
                    }
                    .pdf-title-block {
                        flex: 1;
                    }
                    .pdf-title {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 28px;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: -0.5px;
                        margin: 0;
                        color: #111;
                    }
                    .pdf-subtitle {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        font-weight: 700;
                        color: #555;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-top: 4px;
                    }
                    .pdf-logo {
                        width: 70px;
                        height: 70px;
                        object-fit: contain;
                    }
                    .pdf-info-bar {
                        display: flex;
                        justify-content: space-between;
                        background-color: #f8f9fa;
                        border: 1px solid #e9ecef;
                        padding: 12px 16px;
                        border-radius: 6px;
                        margin-bottom: 24px;
                        font-size: 12px;
                        font-weight: 700;
                        text-transform: uppercase;
                        color: #333;
                    }
                    .pdf-cancha-group {
                        margin-bottom: 24px;
                    }
                    .pdf-cancha-title {
                        font-size: 16px;
                        font-weight: 800;
                        color: white;
                        background-color: #2b3a4a; /* Slate dark */
                        padding: 8px 16px;
                        border-radius: 4px 4px 0 0;
                        margin: 0;
                        text-transform: uppercase;
                    }
                    .pdf-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 13px;
                    }
                    .pdf-table th, .pdf-table td {
                        border: 1px solid #ddd;
                        padding: 10px 12px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    .pdf-table th {
                        background-color: #f1f3f5;
                        font-size: 11px;
                        font-weight: 800;
                        color: #555;
                        text-transform: uppercase;
                    }
                    .pdf-team {
                        font-weight: 800;
                        font-size: 14px;
                        width: 30%;
                    }
                    .pdf-vs {
                        font-weight: 900;
                        font-size: 11px;
                        color: #888;
                        width: 10%;
                    }
                    .pdf-time {
                        font-weight: 700;
                        width: 15%;
                        color: #444;
                    }
                    .pdf-referee {
                        font-size: 11px;
                        color: #666;
                        width: 15%;
                        font-style: italic;
                    }
                    .pdf-footer {
                        margin-top: 40px;
                        padding-top: 16px;
                        border-top: 1px solid #eee;
                        text-align: center;
                        font-size: 10px;
                        color: #888;
                        text-transform: uppercase;
                    }
                `}
            </style>

            <div className="pdf-header">
                <div className="pdf-title-block">
                    <h1 className="pdf-title">Rol de Juego Oficial</h1>
                    <div className="pdf-subtitle">
                        {torneo?.nombre || 'Torneo General'} • Jornada {jornada.numero}
                    </div>
                </div>
                {/* Fallback to text if logo fails to load in print */}
                <img src="/images/logo_final.png" alt="Liga Logo" className="pdf-logo" />
            </div>

            <div className="pdf-info-bar">
                <div>Categoría: {torneo?.categoria?.nombre || 'General'}</div>
                <div>Periodo: {jornada.fecha_inicio} al {jornada.fecha_fin}</div>
            </div>

            {Object.keys(partidosPorCancha).map((canchaNombre, index) => (
                <div key={index} className="pdf-cancha-group no-break">
                    <h2 className="pdf-cancha-title">📍 Sede: {canchaNombre}</h2>
                    <table className="pdf-table">
                        <thead>
                            <tr>
                                <th>Horario</th>
                                <th colSpan="3">Encuentro</th>
                                <th>Cuerpo Arbitral</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidosPorCancha[canchaNombre].map((partido, pIdx) => {
                                const horaDisplay = partido.cancha_horario ? 
                                    `${diaSemanaMap[partido.cancha_horario.dia_semana]} - ${formatHora(partido.cancha_horario.hora)}` : 
                                    'Por definir';

                                const isSuspendido = partido.suspendido;
                                const estado = isSuspendido ? 'SUSPENDIDO' : 'PROGRAMADO';

                                return (
                                    <tr key={pIdx} style={{ backgroundColor: isSuspendido ? '#fff0f0' : 'transparent' }}>
                                        <td className="pdf-time">
                                            {horaDisplay}
                                            {isSuspendido && <div style={{ color: '#d32f2f', fontSize: '9px', marginTop: '4px' }}>SUSPENDIDO</div>}
                                        </td>
                                        <td className="pdf-team" style={{ textAlign: 'right' }}>
                                            {partido.equipo_local?.nombre_mostrado || 'Local'}
                                        </td>
                                        <td className="pdf-vs">VS</td>
                                        <td className="pdf-team" style={{ textAlign: 'left' }}>
                                            {partido.equipo_visitante?.nombre_mostrado || 'Visitante'}
                                        </td>
                                        <td className="pdf-referee">
                                            {partido.arbitros && partido.arbitros.length > 0 ? (
                                                partido.arbitros.map(a => a.nombre).join(', ')
                                            ) : (
                                                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Por asignar</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}

            {partidos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', border: '1px dashed #ccc' }}>
                    No hay partidos programados para esta jornada.
                </div>
            )}

            <div className="pdf-footer">
                Documento generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} • Sistema de Competencia Clúbes Unidos Zapotitlán
            </div>
        </div>
    );
});

export default JornadaPDFExport;
