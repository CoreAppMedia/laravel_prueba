<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Trait para registrar auditoría en los controladores.
 * 
 * Uso:
 * - En el método store: $this->logCreate($model, 'crear');
 * - En el método update: $this->logUpdate($model, $oldValues, $newValues, 'actualizar');
 * - En el método destroy: $this->logDelete($model, 'eliminar');
 * - Para activar/desactivar: $this->logUpdate($model, $oldValues, $newValues, 'activar'|'desactivar');
 */
trait LogsAudit
{
    /**
     * Registrar auditoría de creación
     */
    protected function logCreate(Model $model, string $accion = 'crear'): void
    {
        $this->createAuditLog([
            'accion' => $accion,
            'modelo_tipo' => get_class($model),
            'modelo_id' => $model->id,
            'valores_viejos' => null,
            'valores_nuevos' => $model->toArray(),
        ]);
    }

    /**
     * Registrar auditoría de actualización
     */
    protected function logUpdate(Model $model, array $oldValues, array $newValues, string $accion = 'actualizar'): void
    {
        // Solo registrar los campos que cambiaron
        $changes = array_diff_assoc($newValues, $oldValues);
        $oldValuesFiltered = array_intersect_key($oldValues, $changes);

        if (empty($changes)) {
            return; // No hay cambios, no registrar
        }

        $this->createAuditLog([
            'accion' => $accion,
            'modelo_tipo' => get_class($model),
            'modelo_id' => $model->id,
            'valores_viejos' => $oldValuesFiltered,
            'valores_nuevos' => $changes,
        ]);
    }

    /**
     * Registrar auditoría de eliminación
     */
    protected function logDelete(Model $model, string $accion = 'eliminar'): void
    {
        $this->createAuditLog([
            'accion' => $accion,
            'modelo_tipo' => get_class($model),
            'modelo_id' => $model->id,
            'valores_viejos' => $model->toArray(),
            'valores_nuevos' => null,
        ]);
    }

    /**
     * Registrar auditoría personalizada
     */
    protected function logCustom(string $accion, string $modeloTipo, string $modeloId, ?array $valoresViejos = null, ?array $valoresNuevos = null): void
    {
        $this->createAuditLog([
            'accion' => $accion,
            'modelo_tipo' => $modeloTipo,
            'modelo_id' => $modeloId,
            'valores_viejos' => $valoresViejos,
            'valores_nuevos' => $valoresNuevos,
        ]);
    }

    /**
     * Crear el registro de auditoría
     */
    private function createAuditLog(array $data): void
    {
        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'accion' => $data['accion'],
                'modelo_tipo' => $data['modelo_tipo'],
                'modelo_id' => $data['modelo_id'],
                'valores_viejos' => $data['valores_viejos'],
                'valores_nuevos' => $data['valores_nuevos'],
                'ip' => Request::ip(),
                'user_agent' => Request::userAgent(),
            ]);
        } catch (\Exception $e) {
            // Silenciar errores de auditoría para no afectar la operación principal
            \Log::error('Error al registrar auditoría: ' . $e->getMessage(), [
                'data' => $data,
                'user_id' => Auth::id(),
            ]);
        }
    }
}
