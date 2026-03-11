<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Jornada;
use App\Models\Partido;
use App\Models\EquipoTorneo;
use App\Models\CatalogoEstadoPartido;
use Illuminate\Validation\Rule;

class PartidoController extends Controller
{
    /**
     * Crear un nuevo partido dentro de una jornada.
     * Requisitos:
     * - Equipos distintos
     * - Ambos inscritos en el torneo de la jornada
     */
    public function store(Request $request, Jornada $jornada)
    {
        // Validar que la jornada no esté cerrada
        if ($jornada->cerrada) {
            return response()->json([
                'message' => 'No se pueden programar partidos en una jornada cerrada.'
            ], 422);
        }

        $validated = $request->validate([
            'equipo_local_id' => 'required|uuid|exists:equipos,id',
            'equipo_visitante_id' => 'required|uuid|exists:equipos,id|different:equipo_local_id',
            'fecha' => 'required|date',
            'estado_partido_id' => 'nullable|uuid|exists:catalogo_estados_partido,id'
        ], [
            'equipo_visitante_id.different' => 'Un equipo no puede jugar contra sí mismo.'
        ]);

        $torneo_id = $jornada->torneo_id;

        // Validar que ambos equipos estén inscritos en el torneo
        $localInscrito = EquipoTorneo::where('torneo_id', $torneo_id)->where('equipo_id', $validated['equipo_local_id'])->exists();
        $visitanteInscrito = EquipoTorneo::where('torneo_id', $torneo_id)->where('equipo_id', $validated['equipo_visitante_id'])->exists();

        if (!$localInscrito || !$visitanteInscrito) {
            return response()->json([
                'message' => 'Ambos equipos deben estar inscritos en el torneo para poder enfrentarse.'
            ], 422);
        }

        // Obtener estado inicial (Por defecto 'programado' si no se envía o existe)
        $estadoId = $validated['estado_partido_id'] ?? null;
        if (!$estadoId) {
            $estadoStr = CatalogoEstadoPartido::where('nombre', 'programado')->first();
            $estadoId = $estadoStr ? $estadoStr->id : CatalogoEstadoPartido::first()->id;
        }

        $partido = new Partido();
        $partido->id = \Illuminate\Support\Str::uuid()->toString();
        $partido->jornada_id = $jornada->id;
        $partido->equipo_local_id = $validated['equipo_local_id'];
        $partido->equipo_visitante_id = $validated['equipo_visitante_id'];
        $partido->estado_partido_id = $estadoId;
        $partido->fecha = $validated['fecha'];
        $partido->cerrado = false;
        $partido->save();

        return response()->json([
            'message' => 'Partido programado con éxito.',
            'data' => $partido
        ], 201);
    }

    /**
     * Registrar o actualizar el resultado del partido.
     * Cambia el estado a "finalizado".
     */
    public function registrarResultado(Request $request, Partido $partido)
    {
        if ($partido->cerrado) {
            return response()->json([
                'message' => 'No se puede modificar el resultado de un partido cerrado.'
            ], 422);
        }

        $validated = $request->validate([
            'goles_local' => 'required|integer|min:0',
            'goles_visitante' => 'required|integer|min:0'
        ]);

        $estadoFinalizado = CatalogoEstadoPartido::where('nombre', 'finalizado')->first();

        $partido->goles_local = $validated['goles_local'];
        $partido->goles_visitante = $validated['goles_visitante'];
        
        if ($estadoFinalizado) {
            $partido->estado_partido_id = $estadoFinalizado->id;
        }

        $partido->save();

        return response()->json([
            'message' => 'Resultado registrado con éxito.',
            'data' => $partido
        ]);
    }

    /**
     * Cerrar un partido administrativamente.
     */
    public function cerrarPartido(Partido $partido)
    {
        if ($partido->cerrado) {
            return response()->json([
                'message' => 'El partido ya se encuentra cerrado.'
            ], 422);
        }

        $partido->cerrado = true;
        $partido->save();

        return response()->json([
            'message' => 'Partido cerrado y validado correctamente.',
            'data' => $partido
        ]);
    }
}
