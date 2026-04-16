<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Temporada;
use Illuminate\Validation\ValidationException;

class TemporadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Temporada::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255|unique:temporadas',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
                'activa' => 'boolean',
            ]);

            $temporada = Temporada::create($validated);

            $this->logCreate($temporada, 'crear');

            return response()->json($temporada, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $temporada = Temporada::findOrFail($id);
        return response()->json($temporada);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $temporada = Temporada::findOrFail($id);

        try {
            $validated = $request->validate([
                'nombre' => 'string|max:255|unique:temporadas,nombre,' . $temporada->id,
                'fecha_inicio' => 'date',
                'fecha_fin' => 'date|after_or_equal:fecha_inicio',
                'activa' => 'boolean',
            ]);

            $oldValues = $temporada->toArray();
            $temporada->update($validated);
            $temporada->refresh();

            $this->logUpdate($temporada, $oldValues, $temporada->toArray(), 'actualizar');

            return response()->json($temporada);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $temporada = Temporada::findOrFail($id);
        
        $this->logDelete($temporada, 'eliminar');
        
        $temporada->delete();

        return response()->json(['message' => 'Temporada eliminada correctamente']);
    }
}
