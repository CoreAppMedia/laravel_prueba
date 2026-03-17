<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\Arbitro;

class TorneoArbitroController extends Controller
{
    /**
     * Inscribe un árbitro al torneo (desde el catálogo global).
     */
    public function inscribirArbitro(Request $request, Torneo $torneo)
    {
        $validated = $request->validate([
            'arbitro_id' => 'required|uuid|exists:arbitros,id',
        ]);

        $arbitro = Arbitro::findOrFail($validated['arbitro_id']);

        if (!$arbitro->activo) {
            return response()->json([
                'message' => 'El árbitro seleccionado no está activo.'
            ], 422);
        }

        if ($torneo->arbitros()->wherePivot('arbitro_id', $arbitro->id)->exists()) {
            return response()->json([
                'message' => 'El árbitro ya está inscrito en este torneo.'
            ], 422);
        }

        $torneo->arbitros()->attach($arbitro->id, [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Árbitro inscrito con éxito al torneo.',
            'torneo' => $torneo->nombre,
            'arbitro' => $arbitro->nombre
        ], 201);
    }

    /**
     * Remueve un árbitro del torneo.
     */
    public function desinscribirArbitro(Torneo $torneo, Arbitro $arbitro)
    {
        $torneo->arbitros()->detach($arbitro->id);

        return response()->json([
            'message' => 'Árbitro removido del torneo correctamente.'
        ]);
    }

    /**
     * Obtiene los árbitros inscritos en un torneo.
     */
    public function obtenerArbitrosTorneo(Torneo $torneo)
    {
        $arbitros = $torneo->arbitros()->orderBy('nombre', 'asc')->get();
        return response()->json($arbitros);
    }
}
