<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * Este controlador maneja las operaciones relacionadas con los usuarios, como la actualización de su información, la gestión de sus perfiles y otras acciones administrativas.
 *
 * This controller handles user-related operations, such as updating user information, managing user profiles, and other administrative actions.
 */

class UserController extends Controller
{
    /**
     * Display a listing of the resource. (Lista los usuarios.)
     */
    public function index(Request $request)
    {
        $users = User::with(['permiso', 'rol'])
            ->orderByDesc('id')
            ->get();

        return response()->json($users);
    }

    /**
     * Update the specified user in storage. (Actualiza el usuario especificado en el almacenamiento.)
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8|confirmed',
            'nombre' => 'sometimes|string|max:255',
            'apellido_paterno' => 'sometimes|string|max:255',
            'apellido_materno' => 'sometimes|string|max:255',
            'permiso_id' => 'nullable|exists:permisos,id',
            'rol_id' => 'nullable|exists:roles,id',
            'active' => 'sometimes|boolean',
            'asignado' => 'nullable|array',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $oldValues = $user->toArray();
        $user->update($validated);
        $user->refresh();

        $this->logUpdate($user, $oldValues, $user->toArray(), 'actualizar');

        return response()->json(['message' => 'Usuario actualizado con éxito', 'user' => $user]);
    }

    /**
     * Remove the specified user from storage. (Elimina el usuario especificado del almacenamiento.)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        $this->logDelete($user, 'eliminar');
        
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    /**
     * Activate or deactivate a user. (Activa o desactiva un usuario.)
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'active' => 'required|boolean',
        ]);

        $oldValues = $user->toArray();
        $user->forceFill([
            'active' => $request->active
        ])->save();
        $user->refresh();

        $accion = $request->active ? 'activar' : 'desactivar';
        $this->logUpdate($user, $oldValues, $user->toArray(), $accion);

        $status = $request->active ? 'activado' : 'desactivado';
        return response()->json(['message' => "Usuario {$status} con éxito", 'active' => $user->active]);
    }

    /**
     * Change the password for the specified user. (Cambia la contraseña del usuario especificado.)
     */
    public function changePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
        ]);

        $oldValues = $user->toArray();
        $user->forceFill([
            'password' => Hash::make($request->password)
        ])->save();
        $user->refresh();

        // No loguear la contraseña, solo el hecho de que se cambió
        $this->logCustom('cambiar_password', User::class, $user->id, null, ['password_changed' => true]);

        return response()->json(['message' => 'Contraseña actualizada con éxito']);
    }
}
