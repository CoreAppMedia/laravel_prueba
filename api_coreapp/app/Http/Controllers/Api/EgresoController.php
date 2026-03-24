<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Egreso;
use App\Models\Torneo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EgresoController extends Controller
{
    /**
     * Listado de egresos (salidas) de un torneo.
     */
    public function index(Request $request)
    {
        $query = Egreso::query();

        if ($request->filled('torneo_id')) {
            $query->where('torneo_id', '=', $request->torneo_id);
        }

        if ($request->filled('jornada_id')) {
            $query->where('jornada_id', '=', $request->jornada_id);
        }

        $egresos = $query->orderBy('fecha', 'desc')->get();
        return response()->json($egresos);
    }

    /**
     * Registrar una salida de dinero (egreso).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'torneo_id' => 'nullable|uuid|exists:torneos,id',
            'jornada_id' => 'nullable|uuid|exists:jornadas,id',
            'concepto' => 'required|string|max:255',
            'categoria' => 'nullable|string|max:100',
            'monto' => 'required|numeric|gt:0',
            'fecha' => 'nullable|date',
        ], [
            'monto.gt' => 'El monto del gasto debe ser mayor a cero, ¡no me quieras chamaquear!'
        ]);

        $egreso = new Egreso();
        $egreso->id = (string) Str::uuid();
        $egreso->fill($validated);
        $egreso->fecha = $validated['fecha'] ?? now();
        $egreso->save();

        return response()->json([
            'message' => 'Gasto registrado correctamente.',
            'data' => $egreso
        ], 201);
    }

    /**
     * Eliminar un registro de egreso.
     */
    public function destroy(Egreso $egreso)
    {
        $egreso->delete();
        return response()->json(['message' => 'Registro de egreso eliminado.']);
    }
}
