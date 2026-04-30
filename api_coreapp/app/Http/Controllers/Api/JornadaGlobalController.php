<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JornadaGlobal;
use App\Models\Jornada;
use App\Models\Torneo;
use App\Models\Partido;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JornadaGlobalController extends Controller
{
    /**
     * Listar jornadas globales activas o suspendidas.
     */
    public function index()
    {
        $jornadas = JornadaGlobal::where('estatus', 'activa')
            ->orderBy('fecha_inicio', 'desc')
            ->get();
        return response()->json($jornadas);
    }

    /**
     * Crear una nueva Jornada Global y vincular automáticamente jornadas de torneos activos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha_juego' => 'required|date',
            'nombre' => 'nullable|string|max:255',
        ]);

        Carbon::setLocale('es');

        DB::beginTransaction();
        try {
            $fechaJuego = Carbon::parse($validated['fecha_juego']);
            
            // Calculamos el rango de la semana (Lunes a Domingo) para esa fecha
            $fechaInicio = $fechaJuego->copy()->startOfWeek();
            $fechaFin = $fechaJuego->copy()->endOfWeek();

            // Determinar el número de jornada global
            $lastJG = JornadaGlobal::orderBy('created_at', 'desc')->first();
            $numeroGlobal = $lastJG ? ((int) preg_replace('/[^0-9]/', '', $lastJG->nombre) ?: 0) + 1 : 1;

            $nombre = $validated['nombre'];
            if (!$nombre) {
                $nombre = "Jornada {$numeroGlobal}, " . $fechaJuego->translatedFormat('l d \d\e F \d\e\l Y');
            }

            // 2. Crear la Jornada Global
            $jornadaGlobal = JornadaGlobal::create([
                'id' => Str::uuid()->toString(),
                'nombre' => $nombre,
                'fecha_inicio' => $fechaInicio->toDateString(),
                'fecha_fin' => $fechaFin->toDateString(),
                'estatus' => 'activa',
            ]);

            // 3. Buscar todos los torneos que no estén cerrados o en configuración simple
            $torneosActivos = Torneo::whereIn('estatus', ['activo', 'En Inscripción', 'En Progreso', 'Activo'])->get();
            $jornadasVinculadas = 0;

            foreach ($torneosActivos as $torneo) {
                // Obtener la última jornada de este torneo
                $lastJornada = Jornada::where('torneo_id', $torneo->id)
                    ->orderBy('numero', 'desc')
                    ->first();

                $numero = $lastJornada ? $lastJornada->numero + 1 : 1;

                // Crear la jornada individual vinculada a este periodo global
                $jornada = Jornada::create([
                    'id' => Str::uuid()->toString(),
                    'torneo_id' => $torneo->id,
                    'numero' => $numero,
                    'fecha_inicio' => $jornadaGlobal->fecha_inicio,
                    'fecha_fin' => $jornadaGlobal->fecha_fin,
                    'cerrada' => false,
                ]);

                // Vincular a la Jornada Global
                $jornadaGlobal->jornadas()->attach($jornada->id);
                $jornadasVinculadas++;
            }

            DB::commit();

            return response()->json([
                'message' => "{$jornadaGlobal->nombre} aperturada exitosamente con {$jornadasVinculadas} torneos vinculados.",
                'jornada_global' => $jornadaGlobal
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear la jornada global',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener todos los partidos de todas las jornadas vinculadas a una Jornada Global.
     */
    public function getPartidos(JornadaGlobal $jornadaGlobal)
    {
        $jornadaIds = $jornadaGlobal->jornadas()->pluck('jornadas.id');

        $partidos = Partido::with([
            'equipoLocal', 
            'equipoVisitante', 
            'jornada.torneo', 
            'cancha', 
            'canchaHorario'
        ])
        ->whereIn('jornada_id', $jornadaIds)
        ->get();

        return response()->json($partidos);
    }

    /**
     * Suspender una jornada global.
     */
    public function suspender(Request $request, JornadaGlobal $jornadaGlobal)
    {
        $validated = $request->validate([
            'comentarios' => 'required|string'
        ]);

        $jornadaGlobal->update([
            'estatus' => 'suspendida',
            'comentarios' => $validated['comentarios']
        ]);

        return response()->json(['message' => 'Jornada Global suspendida exitosamente.']);
    }
}
