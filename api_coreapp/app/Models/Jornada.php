<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Jornada extends Model
{
    use HasUuids;

    protected $table = 'jornadas';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'cerrada' => 'boolean',
    ];

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function partidos()
    {
        return $this->hasMany(Partido::class);
    }
}