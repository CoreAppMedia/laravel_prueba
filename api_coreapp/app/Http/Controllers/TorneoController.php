<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Torneo;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class TorneoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Torneo::with(['temporada', 'tipo'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'temporada_id' => 'required|uuid|exists:temporadas,id',
                'tipo_torneo_id' => 'required|uuid|exists:catalogo_tipos_torneo,id',
                'categoria_id' => 'required|uuid|exists:catalogo_categorias,id',
                'nombre' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('torneos')->where(function ($query) use ($request) {
                        return $query->where('temporada_id', $request->temporada_id);
                    })
                ],
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
                'es_abierto' => 'boolean',
                'costo_inscripcion' => 'numeric|min:0',
                'costo_arbitraje_por_partido' => 'numeric|min:0',
                'estatus' => 'string|max:50',
            ]);

            $torneo = Torneo::create($validated);

            return response()->json($torneo, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $torneo = Torneo::with(['temporada', 'tipo'])->findOrFail($id);
        return response()->json($torneo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $torneo = Torneo::findOrFail($id);

        try {
            $validated = $request->validate([
                'temporada_id' => 'uuid|exists:temporadas,id',
                'tipo_torneo_id' => 'uuid|exists:catalogo_tipos_torneo,id',
                'categoria_id' => 'uuid|exists:catalogo_categorias,id',
                'nombre' => [
                    'string',
                    'max:255',
                    Rule::unique('torneos')->where(function ($query) use ($request, $torneo) {
                        $temporadaId = $request->temporada_id ?? $torneo->temporada_id;
                        return $query->where('temporada_id', $temporadaId);
                    })->ignore($torneo->id)
                ],
                'fecha_inicio' => 'date',
                'fecha_fin' => 'date|after_or_equal:fecha_inicio',
                'es_abierto' => 'boolean',
                'costo_inscripcion' => 'numeric|min:0',
                'costo_arbitraje_por_partido' => 'numeric|min:0',
                'estatus' => 'string|max:50',
            ]);

            $torneo->update($validated);

            return response()->json($torneo);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $torneo = Torneo::findOrFail($id);
        $torneo->delete();

        return response()->json(['message' => 'Torneo eliminado correctamente']);
    }
}
