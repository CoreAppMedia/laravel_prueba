<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Directivo extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'directivos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'telefono',
        'direccion',
        'correo_electronico',
        'catalogo_tipo_dueno_id',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function tipo()
    {
        return $this->belongsTo(CatalogoTipoDueno::class, 'catalogo_tipo_dueno_id');
    }

    public function clubDirigido()
    {
        return $this->hasOne(Club::class, 'directivo_id');
    }

    public function equipoDelegado()
    {
        return $this->hasOne(Equipo::class, 'directivo_id');
    }
}
