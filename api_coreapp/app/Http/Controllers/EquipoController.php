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
        return response()->json(Equipo::with(['club', 'categoria'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'club_id' => [
                    'required',
                    'uuid',
                    'exists:clubs,id',
                    Rule::unique('equipos')->where(function ($query) use ($request) {
                        return $query->where('categoria_id', $request->categoria_id);
                    })
                ],
                'categoria_id' => 'required|uuid|exists:catalogo_categorias,id',
                'nombre_mostrado' => 'required|string|max:255',
                'activo' => 'boolean',
            ], [
                'club_id.unique' => 'Ya existe un equipo registrado para este club en la categoría seleccionada.',
            ]);

            $equipo = Equipo::create($validated);

            return response()->json($equipo, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $equipo = Equipo::with(['club', 'categoria'])->findOrFail($id);
        return response()->json($equipo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $equipo = Equipo::findOrFail($id);

        try {
            $validated = $request->validate([
                'club_id' => [
                    'uuid',
                    'exists:clubs,id',
                    Rule::unique('equipos')->where(function ($query) use ($request, $equipo) {
                        $categoriaId = $request->categoria_id ?? $equipo->categoria_id;
                        return $query->where('categoria_id', $categoriaId);
                    })->ignore($equipo->id)
                ],
                'categoria_id' => 'uuid|exists:catalogo_categorias,id',
                'nombre_mostrado' => 'string|max:255',
                'activo' => 'boolean',
            ], [
                'club_id.unique' => 'Ya existe un equipo registrado para este club en la categoría seleccionada.',
            ]);

            $equipo->update($validated);

            return response()->json($equipo);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
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
