<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'confirmed',
                \Illuminate\Validation\Rules\Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'required|string|max:255',
            'permiso_id' => 'nullable|exists:permisos,id',
            'rol_id' => 'nullable|exists:roles,id',
            'asignado' => 'nullable|array',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $exists = \App\Models\User::where(function ($query) {
                $query->where('nombre', $this->nombre)
                      ->where('apellido_paterno', $this->apellido_paterno)
                      ->where('apellido_materno', $this->apellido_materno);
            })->exists();

            if ($exists) {
                $validator->errors()->add('nombre', 'Ya existe un usuario con este nombre completo.');
            }
        });
    }
}
