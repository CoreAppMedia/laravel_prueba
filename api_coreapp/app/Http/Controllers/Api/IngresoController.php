<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingreso;
use App\Models\Torneo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IngresoController extends Controller
{
    /**
     * Listado de ingresos de un torneo.
     */
    public function index(Request $request)
    {
        $query = Ingreso::query();

        if ($request->filled('torneo_id')) {
            $query->where('torneo_id', '=', $request->torneo_id);
        }

        $ingresos = $query->orderBy('fecha', 'desc')->get();
        return response()->json($ingresos);
    }

    /**
     * Registrar un ingreso manual.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'torneo_id' => 'nullable|uuid|exists:torneos,id',
            'concepto' => 'required|string|max:255',
            'categoria' => 'nullable|string|max:100',
            'monto' => 'required|numeric|gt:0',
            'fecha' => 'nullable|date',
        ], [
            'monto.gt' => 'El monto debe ser mayor a cero, ¡no me vengas con vaciladas!'
        ]);

        $ingreso = new Ingreso();
        $ingreso->id = (string) Str::uuid();
        $ingreso->fill($validated);
        $ingreso->fecha = $validated['fecha'] ?? now();
        $ingreso->save();

        return response()->json([
            'message' => 'Ingreso registrado correctamente.',
            'data' => $ingreso
        ], 201);
    }

    /**
     * Eliminar un registro de ingreso.
     */
    public function destroy(Ingreso $ingreso)
    {
        $ingreso->delete();
        return response()->json(['message' => 'Registro de ingreso borrado.']);
    }
}
