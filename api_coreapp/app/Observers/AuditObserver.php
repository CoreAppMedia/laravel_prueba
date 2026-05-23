<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditObserver
{
    /**
     * Handle the Model "created" event.
     */
    public function created(Model $model): void
    {
        $this->logAction($model, 'crear', null, $model->toArray());
    }

    /**
     * Handle the Model "updated" event.
     */
    public function updated(Model $model): void
    {
        $changes = $model->getChanges();
        $oldValues = array_intersect_key($model->getOriginal(), $changes);

        if (empty($changes)) {
            return;
        }

        $this->logAction($model, 'actualizar', $oldValues, $changes);
    }

    /**
     * Handle the Model "deleted" event.
     */
    public function deleted(Model $model): void
    {
        $this->logAction($model, 'eliminar', $model->toArray(), null);
    }

    /**
     * Reusable logging logic.
     */
    private function logAction(Model $model, string $accion, ?array $oldValues, ?array $newValues): void
    {
        if ($model instanceof AuditLog) return;
        
        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'accion' => $accion,
                'modelo_tipo' => get_class($model),
                'modelo_id' => $model->id ?? null,
                'valores_viejos' => $oldValues,
                'valores_nuevos' => $newValues,
                'ip' => Request::ip(),
                'user_agent' => Request::userAgent(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al registrar auditoría (Observer): ' . $e->getMessage());
        }
    }
}
