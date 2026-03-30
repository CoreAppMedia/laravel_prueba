<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Club extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'clubs';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'nombre',
        'es_club',
        'telefono',
        'correo',
        'activo',
        'directivo_id',
    ];

    protected $casts = [
        'es_club' => 'boolean',
        'activo' => 'boolean',
    ];

    public function equipos()
    {
        return $this->hasMany(Equipo::class, 'club_id');
    }

    public function dueno()
    {
        return $this->belongsTo(Directivo::class, 'directivo_id');
    }
}