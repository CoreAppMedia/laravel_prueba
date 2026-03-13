<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cancha;
use App\Models\CanchaHorario;
use Illuminate\Support\Str;

class CanchaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $canchas = Cancha::with('horarios')
            ->orderBy('nombre')
            ->get();
        return response()->json($canchas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'nullable|string',
            'imagen_url' => 'nullable|string',
            'activa' => 'boolean'
        ]);

        $cancha = Cancha::create($validated);
        return response()->json($cancha, 201);
    }

    public function show($id)
    {
        $cancha = Cancha::with('horarios')->findOrFail($id);
        return response()->json($cancha);
    }

    public function update(Request $request, $id)
    {
        $cancha = Cancha::findOrFail($id);
        
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'nullable|string',
            'imagen_url' => 'nullable|string',
            'activa' => 'boolean'
        ]);

        $cancha->update($validated);
        return response()->json($cancha);
    }

    public function destroy($id)
    {
        $cancha = Cancha::findOrFail($id);
        $cancha->delete();
        return response()->json(['message' => 'Cancha eliminada']);
    }

    public function storeHorario(Request $request, $id)
    {
        $cancha = Cancha::findOrFail($id);

        $validated = $request->validate([
            'dia_semana' => 'required|integer|min:1|max:7',
            'hora' => 'required|date_format:H:i',
            'activo' => 'boolean'
        ]);

        $horario = $cancha->horarios()->create($validated);
        return response()->json($horario, 201);
    }

    public function destroyHorario($horarioId)
    {
        $horario = CanchaHorario::findOrFail($horarioId);
        $horario->delete();
        return response()->json(['message' => 'Horario eliminado']);
    }
}
