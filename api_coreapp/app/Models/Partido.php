<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Partido extends Model
{
    use HasUuids;

    protected $table = 'partidos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'fecha' => 'datetime',
        'cerrado' => 'boolean',
    ];

    public function jornada()
    {
        return $this->belongsTo(Jornada::class);
    }

    public function equipoLocal()
    {
        return $this->belongsTo(Equipo::class, 'equipo_local_id');
    }

    public function equipoVisitante()
    {
        return $this->belongsTo(Equipo::class, 'equipo_visitante_id');
    }

    public function estado()
    {
        return $this->belongsTo(CatalogoEstadoPartido::class, 'estado_partido_id');
    }

    public function arbitros()
    {
        return $this->belongsToMany(
            Arbitro::class,
            'partido_arbitro'
        )->using(PartidoArbitro::class)
         ->withPivot('rol', 'pago', 'pagado')
         ->withTimestamps();
    }

    public function multas()
    {
        return $this->hasMany(Multa::class);
    }
}