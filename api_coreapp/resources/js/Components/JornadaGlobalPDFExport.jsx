import React, { forwardRef } from 'react';

const JornadaGlobalPDFExport = forwardRef(({ jornadaGlobal, partidos }, ref) => {
    if (!jornadaGlobal) return null;

    // Group matches by cancha
    const partidosPorCancha = partidos.reduce((acc, partido) => {
        const cancha = partido.cancha?.nombre || 'Sede por definir';
        if (!acc[cancha]) acc[cancha] = [];
        acc[cancha].push(partido);
        return acc;
    }, {});

    // All canchas sorted by name
    const canchas = Object.keys(partidosPorCancha).sort();

    // Build groups of 3 canchas for the 3-column layout
    const groups = [];
    for (let i = 0; i < canchas.length; i += 3) {
        groups.push([canchas[i], canchas[i + 1] || null, canchas[i + 2] || null]);
    }

    const formatHora = (t) => (typeof t === 'string' ? t.substring(0, 5) : '');

    // Format the game date nicely in Spanish
    const formatFecha = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    const CanchaBlock = ({ canchaNombre }) => {
        if (!canchaNombre) return <div />;
        const matchesRaw = partidosPorCancha[canchaNombre] || [];
        const matches = [...matchesRaw].sort((a, b) => {
            const horaA = a.cancha_horario?.hora || '99:99';
            const horaB = b.cancha_horario?.hora || '99:99';
            return horaA.localeCompare(horaB);
        });

        return (
            <div style={{ flex: 1, minWidth: 0, marginBottom: '12px' }}>
                {/* Cancha title */}
                <div style={{
                    color: '#CC0000',
                    fontWeight: 900,
                    fontSize: '11px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                    fontFamily: 'Arial, sans-serif',
                }}>
                    {canchaNombre}
                </div>
                {/* Table */}
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '9px',
                    fontFamily: 'Arial, sans-serif',
                }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>HORA</th>
                            <th style={{ ...thStyle, width: '37%', textAlign: 'left' }}>LOCAL</th>
                            <th style={{ ...thStyle, width: '6%' }}></th>
                            <th style={{ ...thStyle, width: '37%', textAlign: 'left' }}>VISITA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((partido, idx) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f5f5f5' }}>
                                <td style={{ ...tdStyle, fontWeight: 700, color: '#000080', textAlign: 'center' }}>
                                    {formatHora(partido.cancha_horario?.hora)}
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 700 }}>
                                    {partido.equipo_local?.nombre_mostrado || ''}
                                </td>
                                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 900, fontSize: '8px' }}>
                                    VS
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 700 }}>
                                    {partido.equipo_visitante?.nombre_mostrado || ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const thStyle = {
        border: '1px solid #999',
        padding: '3px 5px',
        backgroundColor: '#e8e8e8',
        fontWeight: 900,
        textTransform: 'uppercase',
        fontSize: '8px',
        textAlign: 'center',
    };

    const tdStyle = {
        border: '1px solid #ccc',
        padding: '3px 5px',
    };

    return (
        <div ref={ref}>
        <div style={{
            width: '100%',
            backgroundColor: '#fff',
            padding: '8mm',
            fontFamily: 'Arial, sans-serif',
            color: '#000',
            boxSizing: 'border-box',
        }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
                    <img
                        src="/images/logo_final.png"
                        alt="Logo"
                        style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            color: '#CC0000',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            LIGA DE FUTBOL ZAPOTITLAN
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#000',
                            textTransform: 'uppercase',
                            marginTop: '2px',
                        }}>
                            {jornadaGlobal.nombre}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 900,
                            color: '#000080',
                            textTransform: 'uppercase',
                            marginTop: '2px',
                        }}>
                            {formatFecha(jornadaGlobal.fecha_fin)}
                        </div>
                    </div>
                </div>

                {/* Three-column cancha grid */}
                <div style={{ marginTop: '8px' }}>
                    {groups.map(([left, center, right], idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <CanchaBlock canchaNombre={left} />
                            {center ? <CanchaBlock canchaNombre={center} /> : <div style={{ flex: 1 }} />}
                            {right ? <CanchaBlock canchaNombre={right} /> : <div style={{ flex: 1 }} />}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    paddingTop: '8px',
                    borderTop: '1px solid #999',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#333',
                    textTransform: 'uppercase',
                }}>
                    TEMPORADA 2026
                </div>
            </div>
        </div>
    );
});

export default JornadaGlobalPDFExport;
