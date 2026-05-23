<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationSuccess;
use Illuminate\Validation\Rules\Password;

/**
 * Este controlador maneja las operaciones de autenticación de usuarios,
 * incluyendo el registro, inicio de sesión y gestión de tokens.
 *
 * This controller handles user authentication operations,
 * including registration, login, and token management.
 */
class AuthController extends Controller
{
    private const MAX_ACTIVE_TOKENS = 3;
    private const TOKEN_CLEANUP_BATCH_SIZE = 500;

    private function enforceTokenLimit(User $user): void
    {
        $max = (int) env('SANCTUM_MAX_ACTIVE_TOKENS', self::MAX_ACTIVE_TOKENS);

        if ($max <= 0) {
            return;
        }

        $tokenIdsToDelete = $user->tokens()
            ->latest('created_at')
            ->skip($max)
            ->take(self::TOKEN_CLEANUP_BATCH_SIZE)
            ->pluck('id');

        if ($tokenIdsToDelete->isNotEmpty()) {
            $user->tokens()->whereIn('id', $tokenIdsToDelete)->delete();
        }
    }

    /**
     * Registrar un nuevo usuario. (Register a new user.)           
     */
    public function register(\App\Http\Requests\Auth\RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = new User([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nombre' => $validated['nombre'],
            'apellido_paterno' => $validated['apellido_paterno'],
            'apellido_materno' => $validated['apellido_materno'],
        ]);
        
        $user->permiso_id = $validated['permiso_id'] ?? null;
        $user->rol_id = $validated['rol_id'] ?? null;
        $user->asignado = $validated['asignado'] ?? null;
        $user->save();

        try {
            Mail::to($user)->send(new RegistrationSuccess($user));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error al enviar correo de registro: ' . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $this->enforceTokenLimit($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    /**
     * Inicia sesión a un usuario y devuelve un token. (Login a a user and return a token.)
     */
    public function login(\App\Http\Requests\Auth\LoginRequest $request)
    {
        $validated = $request->validated();

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = User::with(['permiso', 'rol'])->where('email', $validated['email'])->firstOrFail();

        if (!$user->active) {
            return response()->json([
                'message' => 'Cuenta inactiva'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $this->enforceTokenLimit($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Obtiene el usuario autenticado. (Get the authenticated user.)
     */
    public function user(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        return $user->load(['permiso', 'rol']);
    }

    /**
     * Cierra sesión al usuario y inválida el token. (Logout the user and invalidate the token.)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada'
        ]);
    }
}
