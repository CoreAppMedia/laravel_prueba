<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipo;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class EquipoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Equipo::with(['club', 'categoria', 'cancha', 'canchaHorario', 'delegado'])->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Equipo\StoreEquipoRequest $request)
    {
        $validated = $request->validated();

        $equipo = Equipo::create($validated);

        return response()->json($equipo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $equipo = Equipo::with(['club', 'categoria', 'cancha', 'canchaHorario', 'delegado'])->findOrFail($id);
        return response()->json($equipo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(\App\Http\Requests\Equipo\UpdateEquipoRequest $request, string $id)
    {
        $equipo = Equipo::findOrFail($id);

        $validated = $request->validated();

        $equipo->update($validated);

        return response()->json($equipo);
    }

    /**
     * Toggle the active status of the specified resource.
     */
    public function toggleStatus(string $id)
    {
        $equipo = Equipo::findOrFail($id);
        $equipo->activo = !$equipo->activo;
        $equipo->save();

        return response()->json([
            'message' => 'Estado del equipo actualizado correctamente',
            'activo' => $equipo->activo
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $equipo = Equipo::findOrFail($id);
        
        $equipo->delete();

        return response()->json(['message' => 'Equipo eliminado correctamente']);
    }
}
