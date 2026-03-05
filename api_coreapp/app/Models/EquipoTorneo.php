<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EquipoTorneo extends Pivot
{
    use HasUuids;

    protected $table = 'equipo_torneo';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'equipo_id',
        'torneo_id',
        'fecha_inscripcion',
        'pagado_inscripcion',
    ];

    protected $casts = [
        'fecha_inscripcion' => 'datetime',
        'pagado_inscripcion' => 'boolean',
    ];
}