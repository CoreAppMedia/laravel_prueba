<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Directivo;
use App\Models\CatalogoTipoDueno;
use Illuminate\Validation\ValidationException;

class DirectivoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Directivo::with('tipo')->paginate(15));
    }

    /**
     * Obten los directivos disponibles para ser asignados a un Club 
     * (deben ser Dueños que no tengan ya un club).
     */
    public function disponiblesParaClub()
    {
        $tipoDueno = CatalogoTipoDueno::where('nombre', 'Dueño Club')->first();
        if (!$tipoDueno) {
            return response()->json([]);
        }

        $directivos = Directivo::where('catalogo_tipo_dueno_id', $tipoDueno->id)
            ->where('activo', true)
            ->whereDoesntHave('clubDirigido')
            ->get();

        return response()->json($directivos);
    }

    /**
     * Obten los directivos disponibles para ser asignados a un Equipo 
     * (que estén activos y que no tengan ya un equipo asignado).
     * Nota: Permite tanto Dueños como Delegados.
     */
    public function disponiblesParaEquipo()
    {
        $directivos = Directivo::where('activo', true)
            ->whereDoesntHave('equipoDelegado')
            ->get();

        return response()->json($directivos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Directivo\StoreDirectivoRequest $request)
    {
        $validated = $request->validated();

        $directivo = Directivo::create($validated);
        // Load the type for immediate frontend use
        $directivo->load('tipo');

        return response()->json($directivo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $directivo = Directivo::with('tipo')->findOrFail($id);
        return response()->json($directivo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(\App\Http\Requests\Directivo\UpdateDirectivoRequest $request, string $id)
    {
        $directivo = Directivo::findOrFail($id);

        $validated = $request->validated();

        $directivo->update($validated);
        $directivo->load('tipo');

        return response()->json($directivo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $directivo = Directivo::findOrFail($id);
        $directivo->delete();

        return response()->json(['message' => 'Directivo eliminado correctamente']);
    }
}
