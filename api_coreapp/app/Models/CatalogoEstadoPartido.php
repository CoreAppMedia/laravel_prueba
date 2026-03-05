<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CatalogoEstadoPartido extends Model
{
    use HasUuids;

    protected $table = 'catalogo_estados_partido';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function partidos()
    {
        return $this->hasMany(Partido::class, 'estado_partido_id');
    }
}