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
        return response()->json(Temporada::paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Temporada\StoreTemporadaRequest $request)
    {
        $validated = $request->validated();

        $temporada = Temporada::create($validated);

        return response()->json($temporada, 201);
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
    public function update(\App\Http\Requests\Temporada\UpdateTemporadaRequest $request, string $id)
    {
        $temporada = Temporada::findOrFail($id);

        $validated = $request->validated();

        $temporada->update($validated);

        return response()->json($temporada);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $temporada = Temporada::findOrFail($id);
        
        $temporada->delete();

        return response()->json(['message' => 'Temporada eliminada correctamente']);
    }
}
