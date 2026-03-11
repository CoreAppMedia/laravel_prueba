<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\Equipo;
use App\Models\EquipoTorneo;
use Illuminate\Support\Carbon;

class EquipoTorneoController extends Controller
{
    /**
     * Inscribe un equipo a un torneo.
     * Requisitos:
     * - Torneo abierto (es_abierto = true)
     * - Evitar duplicados (ya inscrito)
     * - Validar categoría compatible (equipo.categoria_id == torneo.categoria_id)
     */
    public function inscribirEquipo(Request $request, Torneo $torneo)
    {
        $validated = $request->validate([
            'equipo_id' => 'required|uuid|exists:equipos,id',
            'pagado_inscripcion' => 'boolean'
        ]);

        // 1. Validar que el torneo esté abierto para inscripciones
        if (!$torneo->es_abierto || $torneo->estatus === 'finalizado') {
            return response()->json([
                'message' => 'El torneo no está abierto para inscripciones.'
            ], 422);
        }

        $equipo = Equipo::findOrFail($validated['equipo_id']);

        // 2. Validar que el equipo esté activo
        if (!$equipo->activo) {
            return response()->json([
                'message' => 'El equipo seleccionado no está activo.'
            ], 422);
        }

        // 3. Validar categoría compatible
        // Si el torneo tiene una categoría asignada, el equipo debe coincidir
        if ($torneo->categoria_id && $torneo->categoria_id !== $equipo->categoria_id) {
            return response()->json([
                'message' => 'La categoría del equipo no es compatible con la del torneo.'
            ], 422);
        }

        // 4. Evitar duplicados (el equipo ya está inscrito)
        $existe = EquipoTorneo::where('torneo_id', $torneo->id)
                    ->where('equipo_id', $equipo->id)
                    ->exists();
                    
        if ($existe) {
            return response()->json([
                'message' => 'El equipo ya se encuentra inscrito en este torneo.'
            ], 422);
        }

        // 5. Inscribir al equipo
        $pagado = $validated['pagado_inscripcion'] ?? false;
        
        $torneo->equipos()->attach($equipo->id, [
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'fecha_inscripcion' => now(),
            'pagado_inscripcion' => $pagado,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Equipo inscrito con éxito al torneo.',
            'torneo' => $torneo->nombre,
            'equipo' => $equipo->nombre_mostrado,
            'pago_registrado' => $pagado
        ], 201);
    }

    /**
     * Registra o actualiza el pago de la inscripción de un equipo al torneo.
     */
    public function registrarPago(Request $request, Torneo $torneo, Equipo $equipo)
    {
        $validated = $request->validate([
            'pagado_inscripcion' => 'required|boolean'
        ]);

        $equipoTorneo = EquipoTorneo::where('torneo_id', $torneo->id)
                                    ->where('equipo_id', $equipo->id)
                                    ->first();

        if (!$equipoTorneo) {
            return response()->json([
                'message' => 'El equipo no está inscrito en este torneo.'
            ], 404);
        }

        if ($equipoTorneo->pagado_inscripcion == $validated['pagado_inscripcion']) {
            $estadoStr = $validated['pagado_inscripcion'] ? 'ya está marcado como pagado' : 'ya está marcado como no pagado';
            return response()->json([
                'message' => "El equipo {$estadoStr} en este torneo."
            ], 422);
        }
        
        $equipoTorneo->pagado_inscripcion = $validated['pagado_inscripcion'];
        $equipoTorneo->save();

        // Opcionalmente, aquí se podría registrar un registro en la tabla `ingresos` si se registra como pagado.

        return response()->json([
            'message' => 'Estado de pago actualizado correctamente.',
            'pagado_inscripcion' => $equipoTorneo->pagado_inscripcion
        ]);
    }
    
    /**
     * Obtener listado de equipos inscritos en el torneo.
     */
    public function obtenerEquiposInscritos(Torneo $torneo)
    {
        $equipos = $torneo->equipos()->withPivot('fecha_inscripcion', 'pagado_inscripcion')->get();
        return response()->json($equipos);
    }
}
