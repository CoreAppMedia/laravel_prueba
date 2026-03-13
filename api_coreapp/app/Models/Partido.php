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

    protected $fillable = [
        'jornada_id',
        'equipo_local_id',
        'equipo_visitante_id',
        'estado_partido_id',
        'fecha',
        'cancha_id',
        'cancha_horario_id',
        'goles_local',
        'goles_visitante',
        'cerrado',
        'suspendido',
        'motivo_suspension',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'cerrado' => 'boolean',
        'suspendido' => 'boolean',
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

    public function cancha()
    {
        return $this->belongsTo(Cancha::class);
    }

    public function canchaHorario()
    {
        return $this->belongsTo(CanchaHorario::class);
    }
}