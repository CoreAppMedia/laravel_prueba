<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CatalogoCategoria extends Model
{
    use HasUuids;

    protected $table = 'catalogo_categorias';

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

    public function equipos()
    {
        return $this->hasMany(Equipo::class, 'categoria_id');
    }
}