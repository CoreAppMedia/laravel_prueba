<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $rolesConfig = config('roles.roles');

        $role = collect($rolesConfig)
            ->firstWhere('id', (int) $user->rol_id);

        if (!$role) {
            return response()->json(['message' => 'Rol inválido'], 403);
        }

        $permissions = $role['permissions'];

        // Super wildcard
        if (in_array('*', $permissions)) {
            return $next($request);
        }

        foreach ($permissions as $perm) {

            // Denegaciones explícitas
            if (str_starts_with($perm, '!')) {
                $denied = substr($perm, 1);
                if ($this->match($permission, $denied)) {
                    return response()->json(['message' => 'Acceso denegado'], 403);
                }
            }

            // Permisos normales
            if ($this->match($permission, $perm)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Acceso denegado'], 403);
    }

    private function match(string $required, string $given): bool
    {
        if ($given === '*') return true;

        if (str_contains($given, '*')) {
            $pattern = str_replace('*', '.*', $given);
            return preg_match("/^{$pattern}$/", $required);
        }

        return $required === $given;
    }
}