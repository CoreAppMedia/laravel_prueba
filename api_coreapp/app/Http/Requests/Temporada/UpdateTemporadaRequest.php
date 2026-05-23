<?php

namespace App\Http\Requests\Temporada;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemporadaRequest extends FormRequest
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
        $temporadaId = $this->route('temporada');
        return [
            'nombre' => 'string|max:255|unique:temporadas,nombre,' . $temporadaId,
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date|after_or_equal:fecha_inicio',
            'activa' => 'boolean',
        ];
    }
}
