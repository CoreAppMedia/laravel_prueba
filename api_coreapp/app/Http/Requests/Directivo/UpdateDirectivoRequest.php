<?php

namespace App\Http\Requests\Directivo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDirectivoRequest extends FormRequest
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
            'nombre' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'correo_electronico' => 'nullable|email|max:255',
            'catalogo_tipo_dueno_id' => 'required|uuid|exists:catalogo_tipo_duenos,id',
            'activo' => 'boolean',
        ];
    }
}
