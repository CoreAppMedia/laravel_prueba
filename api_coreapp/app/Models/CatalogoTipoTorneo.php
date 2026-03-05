<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CatalogoTipoTorneo extends Model
{
    use HasUuids;

    protected $table = 'catalogo_tipos_torneo';

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

    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'tipo_torneo_id');
    }
}