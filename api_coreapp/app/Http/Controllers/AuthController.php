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
    public function register(Request $request)
    {
        // 1. Check if the user to be registered is duplicated (verificar si el usuario a registrar esta duplicado)
        $existingUser = User::where('email', $request->email)
            ->orWhere('name', $request->name)
            ->orWhere(function ($query) use ($request) {
                $query->where('nombre', $request->nombre)
                      ->where('apellido_paterno', $request->apellido_paterno)
                      ->where('apellido_materno', $request->apellido_materno);
            })
            ->first();

        if ($existingUser) {
            return response()->json([
                'message' => 'Usuario ya existe',
                'reason' => 'Duplicado detectado (Email, Username, o Nombre Completo)'
            ], 409);
        }

        // 2. Validate the password with a strong policy (Validar la contraseña con una politica fuerte)
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)
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
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'nombre' => $validated['nombre'],
                'apellido_paterno' => $validated['apellido_paterno'],
                'apellido_materno' => $validated['apellido_materno'],
                'permiso_id' => $validated['permiso_id'] ?? null,
                'rol_id' => $validated['rol_id'] ?? null,
                'asignado' => $validated['asignado'] ?? null,
            ]);

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

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Inicia sesión a un usuario y devuelve un token. (Login a a user and return a token.)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

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
        return $request->user();
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
