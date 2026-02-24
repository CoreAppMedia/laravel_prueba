<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Este middleware verifica si el usuario tiene permisos de super administrador.
 * (This middleware checks if the user has super admin permissions.)
 */
class CheckSuperAdmin
{
    /**
     * Handle an incoming request. (Manejar una solicitud entrante.)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $superPermisoId = (int) env('SUPERADMIN_PERMISO_ID', 1);
        $superRolId = (int) env('SUPERADMIN_ROL_ID', 1);

        if ($user && (int) $user->permiso_id === $superPermisoId && (int) $user->rol_id === $superRolId) {
            return $next($request);
        }

        return response()->json(['message' => 'Acceso denegado. Permisos insuficientes'], 403);
    }
}
