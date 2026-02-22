<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Este middleware verifica si la clave de registro es válida.
 * (This middleware checks if the registration key is valid.)
 */
class EnsureRegistrationKey
{
    /**
     * Handle an incoming request. (Manejar una solicitud entrante.)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = config('app.registration_key', env('REGISTRATION_ACCESS_KEY'));

        if (!$apiKey) {
            // If no key is configured, we might want to fail safe or allow (depending on policy).
            // For security, let's fail if not configured to avoid accidental open access.
            // Si no se configura una clave, podríamos querer fallar de forma segura o permitir el acceso (dependiendo de la política).
            // Por seguridad, fallaremos si no está configurada para evitar el acceso abierto accidental.
            return response()->json(['message' => 'Error de configuración del servidor: Clave de registro no configurada.'], 500);
        }

        if ($request->header('X-Registration-Key') !== $apiKey) {
            return response()->json(['message' => 'Acceso denegado: Clave de registro inválida'], 403);
        }

        return $next($request);
    }
}
