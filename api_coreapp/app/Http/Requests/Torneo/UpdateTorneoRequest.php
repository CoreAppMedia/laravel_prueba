<?php

namespace App\Http\Requests\Torneo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTorneoRequest extends FormRequest
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
        $torneoId = $this->route('torneo');
        $torneo = \App\Models\Torneo::find($torneoId);
        
        return [
            'temporada_id' => 'uuid|exists:temporadas,id',
            'tipo_torneo_id' => 'uuid|exists:catalogo_tipos_torneo,id',
            'categoria_id' => 'uuid|exists:catalogo_categorias,id',
            'nombre' => [
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('torneos')->where(function ($query) use ($torneo) {
                    $temporadaId = $this->temporada_id ?? ($torneo ? $torneo->temporada_id : null);
                    return $query->where('temporada_id', $temporadaId);
                })->ignore($torneoId)
            ],
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date|after_or_equal:fecha_inicio',
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
