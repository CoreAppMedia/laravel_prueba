<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partido;
use App\Models\Arbitro;
use App\Models\PartidoArbitro;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartidoArbitroController extends Controller
{
    /**
     * Asignar un árbitro a un partido.
     */
    public function asignar(Request $request, Partido $partido)
    {
        $validated = $request->validate([
            'arbitro_id' => 'required|uuid|exists:arbitros,id',
            'rol' => 'required|string',
            'pago' => 'nullable|numeric|min:0',
        ]);

        $arbitro = Arbitro::findOrFail($validated['arbitro_id']);

        if (!$arbitro->activo) {
            return response()->json(['message' => 'El árbitro seleccionado no está activo.'], 422);
        }

        // Remover si ya existe para evitar duplicados del mismo arbitro en mismo partido
        $partido->arbitros()->detach($arbitro->id);

        $partido->arbitros()->attach($arbitro->id, [
            'id' => (string) Str::uuid(),
            'rol' => $validated['rol'],
            'pago' => $validated['pago'] ?? 0,
            'pagado' => false,
        ]);

        return response()->json([
            'message' => 'Árbitro asignado correctamente.',
            'data' => $partido->load('arbitros')
        ]);
    }

    /**
     * Quitar un árbitro de un partido.
     */
    public function desasignar(Partido $partido, Arbitro $arbitro)
    {
        $partido->arbitros()->detach($arbitro->id);

        return response()->json([
            'message' => 'Árbitro desasignado correctamente.'
        ]);
    }

    /**
     * Marcar/Desmarcar como pagado el arbitraje.
     */
    public function registrarPago(Request $request, $partidoArbitroId)
    {
        $assignment = PartidoArbitro::findOrFail($partidoArbitroId);
        $partido = \App\Models\Partido::find($assignment->partido_id);

        // Permitir pago si el partido ya concluyó, está suspendido, o si tiene estatus de jugado/finalizado
        $esConcluido = $partido->cerrado || $partido->suspendido || in_array(strtolower($partido->estado?->nombre), ['jugado', 'finalizado']);

        if (!$esConcluido) {
            return response()->json([
                'message' => 'Solo se puede registrar el pago de arbitraje una vez que el encuentro ha concluido o ha sido suspendido.'
            ], 422);
        }
        
        $validated = $request->validate([
            'pagado' => 'required|boolean',
            'motivo_pago' => 'nullable|string|max:1000'
        ]);

        $assignment->pagado = $validated['pagado'];
        $assignment->motivo_pago = $validated['motivo_pago'];
        $assignment->save();

        return response()->json([
            'message' => 'Estado de pago actualizado.',
            'data' => $assignment
        ]);
    }
}
