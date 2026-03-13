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
            'fecha' => 'nullable|date',
            'estado_partido_id' => 'nullable|uuid|exists:catalogo_estados_partido,id',
            'cancha_id' => 'nullable|uuid|exists:canchas,id',
            'cancha_horario_id' => 'nullable|uuid|exists:cancha_horarios,id'
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

        // Lógica de cálculo automático de fecha si no se envía pero hay horario
        $fechaFinal = $validated['fecha'] ?? null;

        if (!$fechaFinal && isset($validated['cancha_horario_id'])) {
            if (!$jornada->fecha_inicio || !$jornada->fecha_fin) {
                return response()->json([
                    'message' => 'La jornada debe tener un rango de fechas (Inicio y Fin) para calcular el día del encuentro automáticamente.'
                ], 422);
            }

            $horario = \App\Models\CanchaHorario::find($validated['cancha_horario_id']);
            $diaSemanaBuscado = $horario->dia_semana; // 1 (Lun) - 7 (Dom)

            // Buscar el primer día de la semana que coincida dentro del rango de la jornada
            $start = \Illuminate\Support\Carbon::parse($jornada->fecha_inicio);
            $end = \Illuminate\Support\Carbon::parse($jornada->fecha_fin);
            
            $matchDate = null;
            $current = $start->copy();
            
            while ($current->lte($end)) {
                if ($current->dayOfWeekIso === (int)$diaSemanaBuscado) {
                    $matchDate = $current->toDateString();
                    break;
                }
                $current->addDay();
            }

            if (!$matchDate) {
                return response()->json([
                    'message' => "No se encontró un día { $diaSemanaBuscado } dentro del periodo de la jornada ({$jornada->fecha_inicio} al {$jornada->fecha_fin})."
                ], 422);
            }

            $fechaFinal = $matchDate . ' ' . $horario->hora;
        }

        if (!$fechaFinal) {
             return response()->json([
                'message' => 'Se requiere una fecha específica o seleccionar un horario válido de cancha.'
            ], 422);
        }

        $partido = new Partido();
        $partido->id = \Illuminate\Support\Str::uuid()->toString();
        $partido->jornada_id = $jornada->id;
        $partido->equipo_local_id = $validated['equipo_local_id'];
        $partido->equipo_visitante_id = $validated['equipo_visitante_id'];
        $partido->estado_partido_id = $estadoId;
        $partido->fecha = $fechaFinal;
        
        // Asignar cancha y horario explícitos, o intentar usar los del equipo local
        $equipoLocal = \App\Models\Equipo::find($validated['equipo_local_id']);
        $partido->cancha_id = $validated['cancha_id'] ?? $equipoLocal?->cancha_id;
        $partido->cancha_horario_id = $validated['cancha_horario_id'] ?? $equipoLocal?->cancha_horario_id;
        
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

        $estadoFinalizado = CatalogoEstadoPartido::where('nombre', 'Jugado')->first();
        if (!$estadoFinalizado) {
            // Fallback: try case-insensitive
            $estadoFinalizado = CatalogoEstadoPartido::whereRaw('LOWER(nombre) IN (?, ?, ?)', ['jugado', 'finalizado', 'completado'])->first();
        }

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

    /**
     * Marcar un partido como suspendido con un motivo.
     */
    public function suspenderPartido(Request $request, Partido $partido)
    {
        if ($partido->cerrado) {
            return response()->json([
                'message' => 'No se puede suspender un partido que ya fue cerrado.'
            ], 422);
        }

        $validated = $request->validate([
            'motivo_suspension' => 'required|string|max:500'
        ]);

        $estadoSuspendido = CatalogoEstadoPartido::where('nombre', 'Suspendido')
            ->orWhere('nombre', 'suspendido')
            ->first();

        $partido->suspendido = true;
        $partido->motivo_suspension = $validated['motivo_suspension'];
        if ($estadoSuspendido) {
            $partido->estado_partido_id = $estadoSuspendido->id;
        }
        $partido->save();

        return response()->json([
            'message' => 'Partido marcado como suspendido.',
            'data' => $partido
        ]);
    }

    /**
     * Reactivar un partido suspendido.
     */
    public function reactivarPartido(Partido $partido)
    {
        if ($partido->cerrado) {
            return response()->json([
                'message' => 'No se puede reactivar un partido cerrado.'
            ], 422);
        }

        $estadoProgramado = CatalogoEstadoPartido::where('nombre', 'Programado')
            ->orWhere('nombre', 'programado')
            ->first();

        $partido->suspendido = false;
        $partido->motivo_suspension = null;
        if ($estadoProgramado) {
            $partido->estado_partido_id = $estadoProgramado->id;
        }
        $partido->save();

        return response()->json([
            'message' => 'Partido reactivado.',
            'data' => $partido
        ]);
    }
}
