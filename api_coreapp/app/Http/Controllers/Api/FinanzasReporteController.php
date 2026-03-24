<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingreso;
use App\Models\Egreso;
use App\Models\Torneo;
use App\Models\Jornada;
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
        $ingresos = Ingreso::where('torneo_id', $torneoId)
            ->where('jornada_id', $jornadaId)
            ->get();

        // Egresos vinculados a esta jornada (especialmente pagos a árbitros)
        $egresos = Egreso::where('torneo_id', $torneoId)
            ->where('jornada_id', $jornadaId)
            ->get();
            
        $totalIngresos = $ingresos->sum('monto');
        $totalEgresos = $egresos->sum('monto');

        return response()->json([
            'jornada' => $jornada->numero,
            'fecha_periodo' => "{$jornada->fecha_inicio} al {$jornada->fecha_fin}",
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'totales' => [
                'ingresos' => $totalIngresos,
                'egresos' => $totalEgresos,
                'balance' => $totalIngresos - $totalEgresos
            ]
        ]);
    }
}
