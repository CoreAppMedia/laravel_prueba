import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import http from '../lib/http';
import { Printer } from 'lucide-react';

const ReciboArbitrajeJornadaTemplate = ({ torneoId, jornadaId }) => {
    const componentRef = useRef();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the report data
        axios.get(`/api/finanzas/recibo-arbitraje/${torneoId}/${jornadaId}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching report: ", err);
                setLoading(false);
            });
    }, [torneoId, jornadaId]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Recibo_Arbitraje_Jornada_${data?.jornada}`,
    });

    if (loading) return <div>Cargando plantilla de recibos...</div>;
    if (!data) return <div>Error al cargar los datos.</div>;

    return (
        <div>
            <button 
                onClick={handlePrint} 
                className="mb-4 bg-primary text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                <Printer className="mr-2" size={18} />
                Imprimir Recibo de Arbitraje (PDF)
            </button>

            {/* Este div es el que se imprime */}
            <div ref={componentRef} className="p-8 bg-white text-gray-800" style={{ fontFamily: 'sans-serif' }}>
                
                {/* Cabecera Oficial */}
                <div className="border-b-4 border-gray-800 pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold uppercase">{data.liga}</h1>
                        <h2 className="text-xl font-bold text-gray-600 mt-1">Control de Pagos de Arbitraje</h2>
                    </div>
                    <div className="text-right text-sm text-gray-500 font-mono">
                        <p><strong>Torneo:</strong> {data.torneo}</p>
                        <p><strong>Jornada:</strong> {data.jornada}</p>
                        <p><strong>Expedición:</strong> {data.fecha_impresion}</p>
                    </div>
                </div>

                {/* Lista de Partidos / Cédulas de Pago */}
                <div className="space-y-6">
                    {data.partidos.map((partido, idx) => (
                        <div key={partido.id} className="border-2 border-gray-200 rounded-lg p-4 shadow-sm break-inside-avoid">
                            
                            <div className="flex justify-between items-center mb-3 border-b pb-2">
                                <span className="font-bold text-lg">Partido {idx + 1}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                    ${partido.suspendido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                                `}>
                                    {partido.estado}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div><strong>Fecha:</strong> {partido.fecha}</div>
                                <div><strong>Cancha:</strong> {partido.cancha}</div>
                                {partido.suspendido && (
                                    <div className="col-span-2 text-red-600">
                                        <strong>Motivo Suspensión:</strong> {partido.motivo_suspension}
                                    </div>
                                )}
                            </div>

                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-3">Equipo</th>
                                        <th className="py-2 px-3">Condición</th>
                                        <th className="py-2 px-3 text-center">Estatus Pago</th>
                                        <th className="py-2 px-3">Notas / Motivo No Pago</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="py-2 px-3 font-semibold">{partido.local.nombre}</td>
                                        <td className="py-2 px-3 text-gray-600">Local</td>
                                        <td className="py-2 px-3 text-center">
                                            {partido.local.pago_realizado 
                                                ? <span className="text-green-600 font-bold">✓ PAGADO</span> 
                                                : <span className="text-red-500 font-bold">✗ PENDIENTE</span>
                                            }
                                        </td>
                                        <td className="py-2 px-3 text-gray-500 italic">
                                            {!partido.local.pago_realizado ? (partido.local.motivo_no_pago || '...') : ''}
                                        </td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="py-2 px-3 font-semibold">{partido.visitante.nombre}</td>
                                        <td className="py-2 px-3 text-gray-600">Visitante</td>
                                        <td className="py-2 px-3 text-center">
                                            {partido.visitante.pago_realizado 
                                                ? <span className="text-green-600 font-bold">✓ PAGADO</span> 
                                                : <span className="text-red-500 font-bold">✗ PENDIENTE</span>
                                            }
                                        </td>
                                        <td className="py-2 px-3 text-gray-500 italic">
                                            {!partido.visitante.pago_realizado ? (partido.visitante.motivo_no_pago || '...') : ''}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                    Este documento es un reporte interno oficial de control arbitral generado por CoreAppMedia.
                </div>
            </div>
        </div>
    );
};

export default ReciboArbitrajeJornadaTemplate;
