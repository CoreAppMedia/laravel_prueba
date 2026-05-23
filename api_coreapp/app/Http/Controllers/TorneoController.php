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
        return response()->json(Torneo::with(['temporada', 'tipo'])->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Torneo\StoreTorneoRequest $request)
    {
        $validated = $request->validated();

        $torneo = Torneo::create($validated);

        return response()->json($torneo, 201);
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
    public function update(\App\Http\Requests\Torneo\UpdateTorneoRequest $request, string $id)
    {
        $torneo = Torneo::findOrFail($id);

        $validated = $request->validated();

        $torneo->update($validated);

        return response()->json($torneo);
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
