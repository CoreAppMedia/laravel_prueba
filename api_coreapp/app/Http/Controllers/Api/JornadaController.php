<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\Jornada;
use App\Models\Egreso;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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

        // Validar que todos los partidos estén cerrados O suspendidos
        $partidosPendientes = \App\Models\Partido::where('jornada_id', $jornada->id)
            ->where('cerrado', false)
            ->where('suspendido', false)
            ->with(['equipoLocal', 'equipoVisitante'])
            ->get();

        if ($partidosPendientes->count() > 0) {
            $lista = $partidosPendientes->map(fn($p) => 
                ($p->equipoLocal->nombre_mostrado ?? '?') . ' vs ' . ($p->equipoVisitante->nombre_mostrado ?? '?')
            );
            return response()->json([
                'message' => 'No se puede cerrar la jornada. Aún hay encuentros sin concluir.',
                'partidos_pendientes' => $lista
            ], 422);
        }

        return DB::transaction(function() use ($jornada) {
            $jornada->cerrada = true;
            $jornada->save();

            // Cargar relaciones para evitar múltiples consultas y usar SoftDeletes correctamente
            $jornada->load(['partidos.arbitros', 'partidos.equipoLocal', 'partidos.equipoVisitante']);

            foreach ($jornada->partidos as $partido) {
                foreach ($partido->arbitros as $arbitro) {
                    // Solo generamos egreso si el arbitraje fue marcado como pagado por el administrador
                    if ($arbitro->pivot->pagado && (float)$arbitro->pivot->pago > 0) {
                        $egreso = new Egreso();
                        $egreso->id = (string) Str::uuid();
                        $egreso->torneo_id = $jornada->torneo_id;
                        $egreso->jornada_id = $jornada->id;
                        
                        // Formatear concepto detallado para trazabilidad total
                        $rol = $arbitro->pivot->rol ?: 'Central';
                        $nombreArbitro = $arbitro->nombre;
                        $nombreLocal = $partido->equipoLocal->nombre_mostrado ?? 'Local';
                        $nombreVisitante = $partido->equipoVisitante->nombre_mostrado ?? 'Visita';
                        
                        $egreso->concepto = "Pago Arbitraje ({$rol}) - {$nombreArbitro} - {$nombreLocal} vs {$nombreVisitante}";
                        $egreso->categoria = 'arbitraje';
                        $egreso->monto = (float)$arbitro->pivot->pago;
                        $egreso->fecha = now();
                        
                        // Vinculación polimórfica al registro de asignación original (pivot)
                        $egreso->payable_id = $arbitro->pivot->id;
                        $egreso->payable_type = 'App\Models\PartidoArbitro';
                        $egreso->metodo_pago = 'Efectivo';
                        
                        $egreso->save();
                    }
                }
            }

            return response()->json([
                'message' => 'Jornada cerrada correctamente y egresos detallados generados.',
                'data' => $jornada
            ]);
        });
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
            ->with(['partidos.equipoLocal', 'partidos.equipoVisitante', 'partidos.estado', 'partidos.cancha', 'partidos.canchaHorario', 'partidos.arbitros'])
            ->orderBy('numero', 'desc')
            ->get();
            
        return response()->json($jornadas);
    }
}
