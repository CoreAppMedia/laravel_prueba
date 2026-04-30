<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Partido;
use App\Models\Torneo;
use App\Models\Jornada;
use App\Models\Cancha;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RolDeJuegoController extends Controller
{
    /**
     * Get all matches scheduled for a specific date across all tournaments.
     */
    public function getPartidosPorFecha(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date'
        ]);

        $fecha = Carbon::parse($validated['fecha'])->toDateString();

        // Buscar todos los partidos que su fecha coincida con la fecha solicitada
        // (ignorar la hora en la búsqueda de la fecha base, o buscar por fecha específica)
        // Ya que la fecha en base de datos es datetime, buscamos por Date
        $partidos = Partido::with([
            'equipoLocal', 
            'equipoVisitante', 
            'jornada.torneo', 
            'cancha', 
            'canchaHorario'
        ])
        ->whereDate('fecha', $fecha)
        ->get();

        return response()->json($partidos);
    }

    /**
     * Generar la siguiente jornada automáticamente para todos los torneos activos.
     */
    public function generarJornadasGlobales()
    {
        // Buscar todos los torneos que no estén finalizados
        $torneosActivos = Torneo::where('estatus', '!=', 'finalizado')->get();
        $jornadasCreadas = 0;

        DB::beginTransaction();
        try {
            foreach ($torneosActivos as $torneo) {
                // Obtener la última jornada de este torneo
                $lastJornada = Jornada::where('torneo_id', $torneo->id)
                    ->orderBy('numero', 'desc')
                    ->first();

                $numero = $lastJornada ? $lastJornada->numero + 1 : 1;

                // Cálculo automático de fechas
                if ($numero === 1) {
                    $fechaInicio = $torneo->fecha_inicio ? Carbon::parse($torneo->fecha_inicio)->toDateString() : now()->toDateString();
                } else {
                    $fechaInicio = Carbon::parse($lastJornada->fecha_fin)->addDay()->toDateString();
                }

                $fechaFin = Carbon::parse($fechaInicio)->addDays(6)->toDateString();

                // Crear la jornada
                $jornada = new Jornada();
                $jornada->id = Str::uuid()->toString();
                $jornada->torneo_id = $torneo->id;
                $jornada->numero = $numero;
                $jornada->fecha_inicio = $fechaInicio;
                $jornada->fecha_fin = $fechaFin;
                $jornada->cerrada = false;
                $jornada->save();

                $jornadasCreadas++;
            }
            
            DB::commit();

            return response()->json([
                'message' => "Se aperturaron exitosamente {$jornadasCreadas} jornadas nuevas.",
                'jornadas_creadas' => $jornadasCreadas
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ocurrió un error al generar las jornadas globales.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene solo las canchas que están activas y tienen al menos un equipo activo
     * que participa en un torneo no finalizado.
     */
    public function getCanchasActivas(Request $request)
    {
        $fecha = $request->query('fecha');

        // 1. Canchas que tienen equipos inscritos en torneos no finalizados
        $query = Cancha::whereHas('equipos.torneos', function($q) {
            $q->where('torneos.estatus', '!=', 'finalizado');
        });

        // 2. O canchas que ya tengan un partido programado para la fecha solicitada
        if ($fecha) {
            $query->orWhereHas('partidos', function($q) use ($fecha) {
                $q->whereDate('fecha', $fecha);
            });
        }

        $canchas = $query->with(['horarios' => function($q) {
            $q->where('activo', true);
        }])->get();

        return response()->json($canchas);
    }

    /**
     * Obtiene una lista de todas las fechas únicas cubiertas por las jornadas activas.
     */
    public function getFechasDisponibles()
    {
        $jornadas = Jornada::where('cerrada', false)
            ->whereHas('torneo', function($q) {
                $q->where('estatus', 'activo');
            })
            ->get(['fecha_inicio', 'fecha_fin']);

        $fechasSet = [];
        foreach ($jornadas as $jornada) {
            $inicio = Carbon::parse($jornada->fecha_inicio);
            $fin = Carbon::parse($jornada->fecha_fin);
            
            $actual = $inicio->copy();
            while ($actual->lte($fin)) {
                $fechasSet[] = $actual->toDateString();
                $actual->addDay();
            }
        }

        $fechasUnicas = array_unique($fechasSet);
        sort($fechasUnicas);

        return response()->json(array_values($fechasUnicas));
    }
}
