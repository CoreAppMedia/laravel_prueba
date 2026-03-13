<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Cancha extends Model
{
    use HasUuids;

    protected $fillable = [
        'nombre',
        'direccion',
        'imagen_url',
        'activa'
    ];

    /**
     * Get the horarios associated with the cancha.
     */
    public function horarios()
    {
        return $this->hasMany(CanchaHorario::class);
    }
}
