<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\Jornada;
use Illuminate\Validation\Rule;

class JornadaController extends Controller
{
    /**
     * Crear una nueva jornada para un torneo.
     * Requisitos:
     * - Torneo activo/en configuracion
     * - No duplicar número en el mismo torneo
     */
    public function store(Request $request, Torneo $torneo)
    {
        // Validar que el torneo no esté finalizado
        if ($torneo->estatus === 'finalizado') {
            return response()->json([
                'message' => 'No se pueden crear jornadas para un torneo finalizado.'
            ], 422);
        }

        $lastJornada = Jornada::where('torneo_id', $torneo->id)
            ->orderBy('numero', 'desc')
            ->first();

        $numero = $lastJornada ? $lastJornada->numero + 1 : 1;

        $request->validate([
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $fechaInicio = $request->fecha_inicio;
        $fechaFin = $request->fecha_fin;

        // Cálculo automático de fechas si no se proveen
        if (!$fechaInicio) {
            if ($numero === 1) {
                $fechaInicio = $torneo->fecha_inicio ? $torneo->fecha_inicio->toDateString() : now()->toDateString();
            } else {
                $fechaInicio = \Illuminate\Support\Carbon::parse($lastJornada->fecha_fin)->addDay()->toDateString();
            }
        }

        if (!$fechaFin) {
            $fechaFin = \Illuminate\Support\Carbon::parse($fechaInicio)->addDays(6)->toDateString();
        }

        $jornada = new Jornada();
        $jornada->id = \Illuminate\Support\Str::uuid()->toString();
        $jornada->torneo_id = $torneo->id;
        $jornada->numero = $numero;
        $jornada->fecha_inicio = $fechaInicio;
        $jornada->fecha_fin = $fechaFin;
        $jornada->cerrada = false;
        $jornada->save();

        return response()->json([
            'message' => 'Jornada creada con éxito.',
            'data' => $jornada
        ], 201);
    }

    /**
     * Cerrar una jornada.
     * Requisito:
     * - Marcar como cerrada
     * - (Opcional pero recomendable) Que todos los partidos dentro estén cerrados.
     */
    public function cerrarJornada(Jornada $jornada)
    {
        if ($jornada->cerrada) {
            return response()->json([
                'message' => 'La jornada ya se encuentra cerrada.'
            ], 422);
        }

        // Validar que todos los partidos de la jornada estén cerrados
        $partidosAbiertos = \App\Models\Partido::where('jornada_id', $jornada->id)->where('cerrado', false)->count();
        if ($partidosAbiertos > 0) {
            return response()->json([
                'message' => 'No se puede cerrar la jornada porque existen partidos pendientes de cerrar.',
                'partidos_pendientes' => $partidosAbiertos
            ], 422);
        }

        $jornada->cerrada = true;
        $jornada->save();

        return response()->json([
            'message' => 'Jornada cerrada correctamente.',
            'data' => $jornada
        ]);
    }

    /**
     * Suspender una jornada con un motivo detallado.
     */
    public function suspender(Request $request, Jornada $jornada)
    {
        $validated = $request->validate([
            'motivo' => 'required|string|max:500'
        ]);

        $jornada->suspendida = true;
        $jornada->motivo = $validated['motivo'];
        $jornada->save();

        return response()->json([
            'message' => 'Jornada suspendida oficialmente.',
            'data' => $jornada
        ]);
    }

    /**
     * Reactivar una jornada suspendida.
     */
    public function reactivar(Jornada $jornada)
    {
        $jornada->suspendida = false;
        // Mantenemos el motivo anterior como historial o lo limpiamos. Por ahora lo limpiamos.
        $jornada->motivo = null;
        $jornada->save();

        return response()->json([
            'message' => 'Jornada reactivada.',
            'data' => $jornada
        ]);
    }

    /**
     * Eliminar una jornada.
     * Solo si no tiene partidos registrados (integridad).
     */
    public function destroy(Jornada $jornada)
    {
        $count = $jornada->partidos()->count();
        
        if ($count > 0) {
            return response()->json([
                'message' => 'No se puede eliminar una jornada que ya tiene partidos programados. Elimina primero los partidos.'
            ], 422);
        }

        $jornada->delete();

        return response()->json([
            'message' => 'Jornada eliminada correctamente.'
        ]);
    }

    /**
     * Listar jornadas de un torneo.
     */
    public function indexByTorneo(Torneo $torneo)
    {
        $jornadas = $torneo->jornadas()
            ->with(['partidos.equipoLocal', 'partidos.equipoVisitante', 'partidos.estado', 'partidos.cancha', 'partidos.canchaHorario'])
            ->orderBy('numero', 'asc')
            ->get();
            
        return response()->json($jornadas);
    }
}
