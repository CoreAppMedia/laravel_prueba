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
        return response()->json(Club::with('dueno')->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Club\StoreClubRequest $request)
    {
        $validated = $request->validated();

        $club = Club::create($validated);

        return response()->json($club, 201);
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
    public function update(\App\Http\Requests\Club\UpdateClubRequest $request, string $id)
    {
        $club = Club::findOrFail($id);

        $validated = $request->validated();

        $club->update($validated);

        return response()->json($club);
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
