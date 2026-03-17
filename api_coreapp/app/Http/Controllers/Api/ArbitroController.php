<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Arbitro;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArbitroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $arbitros = Arbitro::orderBy('nombre', 'asc')->get();
        return response()->json($arbitros);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'activo' => 'boolean',
        ]);

        $arbitro = new Arbitro();
        $arbitro->id = (string) Str::uuid();
        $arbitro->nombre = $validated['nombre'];
        $arbitro->telefono = $validated['telefono'] ?? null;
        $arbitro->activo = $validated['activo'] ?? true;
        $arbitro->save();

        return response()->json($arbitro, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Arbitro $arbitro)
    {
        return response()->json($arbitro);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Arbitro $arbitro)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'activo' => 'boolean',
        ]);

        $arbitro->update($validated);

        return response()->json($arbitro);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Arbitro $arbitro)
    {
        $arbitro->delete();
        return response()->json(['message' => 'Árbitro eliminado correctamente']);
    }
}
