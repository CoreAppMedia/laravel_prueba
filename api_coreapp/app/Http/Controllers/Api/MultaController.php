<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Multa;
use App\Models\Ingreso;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MultaController extends Controller
{
    /**
     * Listado de multas con filtros básicos.
     */
    public function index(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = Multa::query()->with(['equipo', 'torneo', 'tipo_multa']);

        if ($request->filled('equipo_id')) {
            $query->where('equipo_id', '=', $request->equipo_id);
        }

        if ($request->filled('torneo_id')) {
            $query->where('torneo_id', '=', $request->torneo_id);
        }

        if ($request->filled('pagada')) {
            $query->where('pagada', '=', $request->boolean('pagada'));
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Registrar una nueva multa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipo_id' => 'required|uuid|exists:equipos,id',
            'torneo_id' => 'required|uuid|exists:torneos,id',
            'tipo_multa_id' => 'required|uuid|exists:catalogo_tipos_multa,id',
            'partido_id' => 'nullable|uuid|exists:partidos,id',
            'motivo' => 'required|string|max:500',
            'monto' => 'required|numeric|gt:0',
            'fecha' => 'nullable|date',
        ], [
            'equipo_id.required' => 'La multa debe estar asignada a un equipo a fuerzas.',
            'monto.gt' => 'El monto de la multa debe ser mayor a cero, no seas gacho.',
        ]);

        $multa = new Multa();
        $multa->id = (string) Str::uuid();
        $multa->fill($validated);
        $multa->pagada = false;
        $multa->fecha = $validated['fecha'] ?? now();
        $multa->save();

        return response()->json([
            'message' => 'Multa registrada correctamente.',
            'data' => $multa->load(['equipo', 'tipoMulta'])
        ], 201);
    }

    /**
     * Ver detalle de una multa.
     */
    public function show(Multa $multa)
    {
        return response()->json($multa->load(['equipo', 'torneo', 'tipoMulta', 'partido']));
    }

    /**
     * Actualizar datos de la multa (solo si no se ha pagado).
     */
    public function update(Request $request, Multa $multa)
    {
        if ($multa->pagada) {
            return response()->json([
                'message' => 'Esta multa ya está pagada, ya no le muevas al monto ni al motivo.'
            ], 422);
        }

        $validated = $request->validate([
            'motivo' => 'sometimes|required|string|max:500',
            'monto' => 'sometimes|required|numeric|gt:0',
            'fecha' => 'nullable|date',
        ]);

        $multa->update($validated);

        return response()->json([
            'message' => 'Multa actualizada correctamente.',
            'data' => $multa
        ]);
    }

    /**
     * Registrar el pago de la multa y generar el ingreso correspondiente, o revertirlo.
     */
    public function registrarPago(Request $request, Multa $multa)
    {
        $validated = $request->validate([
            'pagada' => 'required|boolean',
            'metodo_pago' => 'nullable|string'
        ]);

        if ($multa->pagada == $validated['pagada']) {
            $estadoStr = $validated['pagada'] ? 'ya fue liquidada' : 'ya está marcada como pendiente';
            return response()->json(['message' => "Esta multa {$estadoStr}."], 422);
        }

        try {
            DB::beginTransaction();

            $multa->pagada = $validated['pagada'];
            $multa->save();

            if ($validated['pagada']) {
                // 2. Generar registro de Ingreso automáticamente
                $ingreso = new Ingreso();
                $ingreso->id = (string) Str::uuid();
                $ingreso->torneo_id = $multa->torneo_id;
                $ingreso->concepto = "Pago de Multa: " . ($multa->tipoMulta->nombre ?? 'General') . " - Equipo: " . $multa->equipo->nombre_mostrado;
                $ingreso->categoria = 'multa';
                $ingreso->monto = $multa->monto;
                $ingreso->fecha = now();
                $ingreso->payable_id = $multa->id;
                $ingreso->payable_type = Multa::class;
                $ingreso->metodo_pago = $validated['metodo_pago'] ?? 'Efectivo';
                $ingreso->save();

                $message = 'Pago de multa registrado con éxito. Se generó un registro de ingreso automáticamente.';
            } else {
                // Revertir pago y anular el ingreso vinculado
                Ingreso::where('payable_id', $multa->id)
                    ->where('payable_type', Multa::class)
                    ->delete();
                
                $message = 'Pago de multa anulado correctamente. El ingreso vinculado fue eliminado.';
                $ingreso = null;
            }

            DB::commit();

            return response()->json([
                'message' => $message,
                'multa' => $multa,
                'ingreso' => $ingreso ?? null
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al registrar pago de multa: " . $e->getMessage());
            return response()->json([
                'message' => 'Hubo una bronca al registrar el pago. Intenta de nuevo.'
            ], 500);
        }
    }

    /**
     * Eliminar una multa (solo si no ha sido pagada).
     */
    public function destroy(Multa $multa)
    {
        if ($multa->pagada) {
            return response()->json([
                'message' => 'No puedes borrar una multa que ya se pagó. ¡Haya orden!'
            ], 422);
        }

        $multa->delete();

        return response()->json(['message' => 'Multa eliminada correctamente.']);
    }
}
