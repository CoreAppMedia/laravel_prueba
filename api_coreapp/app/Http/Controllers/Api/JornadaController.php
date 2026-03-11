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

        $validated = $request->validate([
            'numero' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('jornadas')->where(function ($query) use ($torneo) {
                    return $query->where('torneo_id', $torneo->id);
                })
            ],
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $jornada = new Jornada();
        $jornada->id = \Illuminate\Support\Str::uuid()->toString();
        $jornada->torneo_id = $torneo->id;
        $jornada->numero = $validated['numero'];
        $jornada->fecha_inicio = $validated['fecha_inicio'] ?? null;
        $jornada->fecha_fin = $validated['fecha_fin'] ?? null;
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
        // Podríamos también establecer fecha_fin si no la tiene
        $jornada->save();

        return response()->json([
            'message' => 'Jornada cerrada correctamente.',
            'data' => $jornada
        ]);
    }

    /**
     * Listar jornadas de un torneo.
     */
    public function indexByTorneo(Torneo $torneo)
    {
        $jornadas = $torneo->jornadas()
            ->with(['partidos.equipoLocal', 'partidos.equipoVisitante', 'partidos.estado'])
            ->orderBy('numero', 'asc')
            ->get();
            
        return response()->json($jornadas);
    }
}
