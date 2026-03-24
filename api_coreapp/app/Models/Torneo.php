<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Torneo extends Model
{
    use HasUuids;

    protected $table = 'torneos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'temporada_id',
        'tipo_torneo_id',
        'categoria_id',
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'dias_juego',
        'es_abierto',
        'costo_inscripcion',
        'costo_arbitraje_por_partido',
        'monto_pago_arbitro',
        'estatus',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'dias_juego' => 'array',
        'es_abierto' => 'boolean',
        'costo_inscripcion' => 'decimal:2',
        'costo_arbitraje_por_partido' => 'decimal:2',
        'monto_pago_arbitro' => 'decimal:2',
    ];

    public function temporada()
    {
        return $this->belongsTo(Temporada::class);
    }

    public function tipo()
    {
        return $this->belongsTo(CatalogoTipoTorneo::class, 'tipo_torneo_id');
    }

    public function categoria()
    {
        return $this->belongsTo(CatalogoCategoria::class, 'categoria_id');
    }

    public function jornadas()
    {
        return $this->hasMany(Jornada::class);
    }

    public function equipos()
    {
        return $this->belongsToMany(
            Equipo::class,
            'equipo_torneo'
        )->using(EquipoTorneo::class)
         ->withPivot('fecha_inscripcion', 'pagado_inscripcion')
         ->withTimestamps();
    }

    public function ingresos()
    {
        return $this->hasMany(Ingreso::class);
    }

    public function egresos()
    {
        return $this->hasMany(Egreso::class);
    }

    public function arbitros()
    {
        return $this->belongsToMany(Arbitro::class, 'torneo_arbitro')
            ->withTimestamps();
    }
}