<?php

namespace App\Http\Requests\Torneo;

use Illuminate\Foundation\Http\FormRequest;

class StoreTorneoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'temporada_id' => 'required|uuid|exists:temporadas,id',
            'tipo_torneo_id' => 'required|uuid|exists:catalogo_tipos_torneo,id',
            'categoria_id' => 'required|uuid|exists:catalogo_categorias,id',
            'nombre' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('torneos')->where(function ($query) {
                    return $query->where('temporada_id', $this->temporada_id);
                })
            ],
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'es_abierto' => 'boolean',
            'costo_inscripcion' => 'numeric|min:0',
            'costo_arbitraje_por_partido' => 'numeric|min:0',
            'monto_pago_arbitro' => 'numeric|min:0',
            'estatus' => 'string|max:50',
            'dias_juego' => 'nullable|array',
            'dias_juego.*' => 'integer|min:1|max:7',
        ];
    }
}
