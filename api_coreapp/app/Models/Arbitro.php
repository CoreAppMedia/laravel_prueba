<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Arbitro extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'arbitros';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'telefono',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function partidos()
    {
        return $this->belongsToMany(
            Partido::class,
            'partido_arbitro'
        )->using(PartidoArbitro::class)
         ->withPivot('rol', 'pago', 'pagado')
         ->withTimestamps();
    }

    public function torneos()
    {
        return $this->belongsToMany(Torneo::class, 'torneo_arbitro')
            ->withTimestamps();
    }
}