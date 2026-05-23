<?php

namespace App\Http\Requests\Club;

use Illuminate\Foundation\Http\FormRequest;

class StoreClubRequest extends FormRequest
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
            'nombre' => 'required|string|max:255|unique:clubs',
            'es_club' => 'boolean',
            'telefono' => 'nullable|string|max:20',
            'correo' => 'nullable|email|max:255',
            'activo' => 'boolean',
            'directivo_id' => 'nullable|uuid|exists:directivos,id|unique:clubs,directivo_id',
        ];
    }

    public function messages(): array
    {
        return [
            'directivo_id.unique' => 'El Dueño seleccionado ya se encuentra dirigiendo otro Club.'
        ];
    }
}
