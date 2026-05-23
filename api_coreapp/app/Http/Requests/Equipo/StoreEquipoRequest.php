<?php

namespace App\Http\Requests\Equipo;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipoRequest extends FormRequest
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
            'club_id' => [
                'required',
                'uuid',
                'exists:clubs,id',
                \Illuminate\Validation\Rule::unique('equipos')->where(function ($query) {
                    return $query->where('categoria_id', $this->categoria_id);
                })
            ],
            'categoria_id' => 'required|uuid|exists:catalogo_categorias,id',
            'nombre_mostrado' => 'required|string|max:255',
            'cancha_id' => 'nullable|uuid|exists:canchas,id',
            'cancha_horario_id' => 'nullable|uuid|exists:cancha_horarios,id',
            'activo' => 'boolean',
            'directivo_id' => 'nullable|uuid|exists:directivos,id|unique:equipos,directivo_id',
        ];
    }

    public function messages(): array
    {
        return [
            'club_id.unique' => 'Ya existe un equipo registrado para este club en la categoría seleccionada.',
            'directivo_id.unique' => 'El Delegado/Dueño seleccionado ya tiene un Equipo asignado.',
        ];
    }
}
