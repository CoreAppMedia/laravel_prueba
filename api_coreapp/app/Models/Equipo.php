<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Equipo extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'equipos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'club_id',
        'categoria_id',
        'nombre_mostrado',
        'directivo_id',
        'cancha_id',
        'cancha_horario_id',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function categoria()
    {
        return $this->belongsTo(CatalogoCategoria::class, 'categoria_id');
    }

    public function delegado()
    {
        return $this->belongsTo(Directivo::class, 'directivo_id');
    }

    public function torneos()
    {
        return $this->belongsToMany(
            Torneo::class,
            'equipo_torneo'
        )->using(EquipoTorneo::class)
         ->withPivot('fecha_inscripcion', 'pagado_inscripcion')
         ->withTimestamps();
    }

    public function partidosLocal()
    {
        return $this->hasMany(Partido::class, 'equipo_local_id');
    }

    public function partidosVisitante()
    {
        return $this->hasMany(Partido::class, 'equipo_visitante_id');
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