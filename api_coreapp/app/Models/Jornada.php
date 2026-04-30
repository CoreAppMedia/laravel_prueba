<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Jornada extends Model
{
    use HasUuids;

    protected $table = 'jornadas';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'torneo_id',
        'numero',
        'fecha_inicio',
        'fecha_fin',
        'cerrada',
        'suspendida',
        'motivo'
    ];

    protected $casts = [
        'cerrada' => 'boolean',
        'suspendida' => 'boolean',
    ];

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function partidos()
    {
        return $this->hasMany(Partido::class);
    }

    public function jornadasGlobales()
    {
        return $this->belongsToMany(JornadaGlobal::class, 'jornada_global_jornada', 'jornada_id', 'jornada_global_id');
    }
}