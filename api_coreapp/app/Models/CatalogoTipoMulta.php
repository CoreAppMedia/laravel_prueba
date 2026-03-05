<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CatalogoTipoMulta extends Model
{
    use HasUuids;

    protected $table = 'catalogo_tipos_multa';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'es_economica',
        'monto_default',
        'activo',
    ];

    protected $casts = [
        'es_economica' => 'boolean',
        'activo' => 'boolean',
        'monto_default' => 'decimal:2',
    ];

    public function multas()
    {
        return $this->hasMany(Multa::class, 'tipo_multa_id');
    }
}