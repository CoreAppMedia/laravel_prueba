<?php

namespace App\Http\Requests\Club;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClubRequest extends FormRequest
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
        $clubId = $this->route('club');

        return [
            'nombre' => 'string|max:255|unique:clubs,nombre,' . $clubId,
            'es_club' => 'boolean',
            'telefono' => 'nullable|string|max:20',
            'correo' => 'nullable|email|max:255',
            'activo' => 'boolean',
            'directivo_id' => 'nullable|uuid|exists:directivos,id|unique:clubs,directivo_id,' . $clubId,
        ];
    }

    public function messages(): array
    {
        return [
            'directivo_id.unique' => 'El Dueño seleccionado ya se encuentra dirigiendo otro Club.'
        ];
    }
}
