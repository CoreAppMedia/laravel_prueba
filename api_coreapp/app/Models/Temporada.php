<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Temporada extends Model
{
    use HasUuids;

    protected $table = 'temporadas';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'activa',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'activa' => 'boolean',
    ];

    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'temporada_id');
    }
}