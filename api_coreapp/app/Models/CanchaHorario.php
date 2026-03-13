<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CanchaHorario extends Model
{
    use HasUuids;

    protected $fillable = [
        'cancha_id',
        'dia_semana',
        'hora',
        'activo'
    ];

    /**
     * Get the cancha that owns the horario.
     */
    public function cancha()
    {
        return $this->belongsTo(Cancha::class);
    }
}
