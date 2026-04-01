<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingreso;
use App\Models\Egreso;
use App\Models\Torneo;
use App\Models\Jornada;
use App\Models\Partido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanzasReporteController extends Controller
{
    /**
     * Obtener el balance global de la liga.
     */
    public function balanceGlobal()
    {
        $ingresosTotal = Ingreso::sum('monto');
        $egresosTotal = Egreso::sum('monto');
        
        // Ingresos por categoría
        $porCategoriaIngreso = Ingreso::select('categoria', DB::raw('SUM(monto) as total'))
            ->groupBy('categoria')
            ->get();
            
        // Egresos por categoría
        $porCategoriaEgreso = Egreso::select('categoria', DB::raw('SUM(monto) as total'))
            ->groupBy('categoria')
            ->get();

        return response()->json([
            'totales' => [
                'ingresos' => $ingresosTotal,
                'egresos' => $egresosTotal,
                'balance' => $ingresosTotal - $egresosTotal,
            ],
            'categorias' => [
                'ingresos' => $porCategoriaIngreso,
                'egresos' => $porCategoriaEgreso,
            ]
        ]);
    }

    /**
     * Resumen financiero de un torneo específico.
     */
    public function resumenTorneo($torneoId)
    {
        $torneo = Torneo::findOrFail($torneoId);
        
        $ingresos = Ingreso::where('torneo_id', $torneoId)->sum('monto');
        $egresos = Egreso::where('torneo_id', $torneoId)->sum('monto');
        
        $egresosDetalle = Egreso::where('torneo_id', $torneoId)
            ->select('categoria', DB::raw('SUM(monto) as total'))
            ->groupBy('categoria')
            ->get();

        return response()->json([
            'torneo' => $torneo->nombre_mostrado,
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'balance' => $ingresos - $egresos,
            'detalle_egresos' => $egresosDetalle
        ]);
    }

    /**
     * Resumen de egresos por jornada (especialmente para arbitrajes).
     */
    public function resumenJornada($torneoId, $jornadaId)
    {
        $jornada = Jornada::findOrFail($jornadaId);
        
        // Ingresos vinculados a esta jornada (especialmente arbitrajes)
        $ingresos = Ingreso::where('torneo_id', (string)$torneoId)
            ->where('jornada_id', (string)$jornadaId)
            ->get();

        // Egresos vinculados a esta jornada (historial contable)
        $egresos = Egreso::where('torneo_id', (string)$torneoId)
            ->where('jornada_id', (string)$jornadaId)
            ->get();

        // Detalle de arbitraje (Audit level) basado en los partidos
        $partidos = Partido::with(['arbitros', 'equipoLocal', 'equipoVisitante'])
            ->where('jornada_id', (string)$jornadaId)
            ->get();

        $detalles_arbitraje = [];
        foreach ($partidos as $partido) {
            foreach ($partido->arbitros as $arbitro) {
                if ($arbitro->pivot->pagado) {
                    $detalles_arbitraje[] = [
                        'partido_id' => $partido->id,
                        'partido_nombre' => ($partido->equipoLocal->nombre_mostrado ?? 'Local') . " vs " . ($partido->equipoVisitante->nombre_mostrado ?? 'Visita'),
                        'arbitro_nombre' => $arbitro->nombre,
                        'rol' => $arbitro->pivot->rol,
                        'monto' => $arbitro->pivot->pago,
                    ];
                }
            }
        }
            
        $totalIngresos = $ingresos->sum('monto');
        $totalEgresos = $egresos->sum('monto');

        return response()->json([
            'jornada' => $jornada->numero,
            'cerrada' => $jornada->cerrada,
            'fecha_periodo' => "{$jornada->fecha_inicio} al {$jornada->fecha_fin}",
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'detalles_arbitraje' => $detalles_arbitraje,
            'totales' => [
                'ingresos' => $totalIngresos,
                'egresos' => $totalEgresos,
                'balance' => $totalIngresos - $totalEgresos
            ]
        ]);
    }

    /**
     * Generar datos para la Plantilla del Recibo de Pago de Arbitraje por Jornada.
     * Incluye datos vitales de por qué no se pagó si se suspendió.
     */
    public function reciboArbitrajeJornada($torneoId, $jornadaId)
    {
        $jornada = Jornada::with(['torneo'])->findOrFail($jornadaId);

        $partidos = Partido::with(['equipoLocal', 'equipoVisitante', 'cancha'])
            ->where('jornada_id', (string)$jornadaId)
            ->get()
            ->map(function ($partido) {
                return [
                    'id' => $partido->id,
                    'fecha' => $partido->fecha ? $partido->fecha->format('Y-m-d H:i') : 'Sin definir',
                    'cancha' => $partido->cancha->nombre ?? 'Sin definir',
                    'estado' => $partido->estado->nombre ?? ($partido->suspendido ? 'Suspendido' : 'Programado'),
                    'cerrado' => $partido->cerrado,
                    'suspendido' => $partido->suspendido,
                    'motivo_suspension' => $partido->motivo_suspension,
                    
                    'local' => [
                        'nombre' => $partido->equipoLocal->nombre_mostrado ?? 'N/A',
                        'pago_realizado' => $partido->pago_arbitro_local,
                        'motivo_no_pago' => $partido->motivo_no_pago_arbitro_local,
                    ],
                    'visitante' => [
                        'nombre' => $partido->equipoVisitante->nombre_mostrado ?? 'N/A',
                        'pago_realizado' => $partido->pago_arbitro_visitante,
                        'motivo_no_pago' => $partido->motivo_no_pago_arbitro_visitante,
                    ],
                    'costo_arbitraje_total' => $partido->costo_arbitraje_total,
                ];
            });

        // Podemos retornar la vista Blade o los datos en JSON para que "react-to-print" arme el UI.
        // Retornaremos un JSON enriquecido que la capa frontend de React pueda inyectar en su plantilla imprimible.
        return response()->json([
            'liga' => 'CoreAppMedia',
            'torneo' => $jornada->torneo->nombre,
            'jornada' => $jornada->numero,
            'fecha_impresion' => now()->format('Y-m-d H:i:s'),
            'partidos' => $partidos,
        ]);
    }
}
