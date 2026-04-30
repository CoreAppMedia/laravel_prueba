<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class JornadaGlobal extends Model
{
    use HasUuids;

    protected $table = 'jornadas_globales';

    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'estatus',
        'comentarios',
    ];

    /**
     * Get the individual jornadas associated with this global matchday.
     */
    public function jornadas()
    {
        return $this->belongsToMany(Jornada::class, 'jornada_global_jornada', 'jornada_global_id', 'jornada_id');
    }
}
