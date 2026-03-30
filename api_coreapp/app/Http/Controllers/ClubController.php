<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Club;
use Illuminate\Validation\ValidationException;

class ClubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Club::with('dueno')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255|unique:clubs',
                'es_club' => 'boolean',
                'telefono' => 'nullable|string|max:20',
                'correo' => 'nullable|email|max:255',
                'activo' => 'boolean',
                'directivo_id' => 'nullable|uuid|exists:directivos,id|unique:clubs,directivo_id',
            ], [
                'directivo_id.unique' => 'El Dueño seleccionado ya se encuentra dirigiendo otro Club.'
            ]);

            $club = Club::create($validated);

            return response()->json($club, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $club = Club::with('dueno')->findOrFail($id);
        return response()->json($club);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $club = Club::findOrFail($id);

        try {
            $validated = $request->validate([
                'nombre' => 'string|max:255|unique:clubs,nombre,' . $club->id,
                'es_club' => 'boolean',
                'telefono' => 'nullable|string|max:20',
                'correo' => 'nullable|email|max:255',
                'activo' => 'boolean',
                'directivo_id' => 'nullable|uuid|exists:directivos,id|unique:clubs,directivo_id,' . $club->id,
            ], [
                'directivo_id.unique' => 'El Dueño seleccionado ya se encuentra dirigiendo otro Club.'
            ]);

            $club->update($validated);

            return response()->json($club);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $club = Club::findOrFail($id);
        $club->delete();

        return response()->json(['message' => 'Club eliminado correctamente']);
    }
}
