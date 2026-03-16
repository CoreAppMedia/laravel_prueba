<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminOrDev
{
    /**
     * Permite acceso a usuarios con permiso "admin" o "desarrollador".
     * También permite acceso al superadmin configurado por IDs en .env.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        $superPermisoId = (int) env('SUPERADMIN_PERMISO_ID', 1);
        $superRolId = (int) env('SUPERADMIN_ROL_ID', 1);

        if ((int) $user->permiso_id === $superPermisoId && (int) $user->rol_id === $superRolId) {
            return $next($request);
        }

        $user->loadMissing(['permiso']);
        $permisoNombre = $user->permiso?->nombre;

        if (in_array($permisoNombre, ['admin', 'desarrollador'], true)) {
            return $next($request);
        }

        return response()->json(['message' => 'Acceso denegado. Permisos insuficientes'], 403);
    }
}
