<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Egreso extends Model
{
    use HasUuids;

    protected $table = 'egresos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'torneo_id',
        'jornada_id',
        'concepto',
        'categoria',
        'monto',
        'fecha',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha' => 'datetime',
    ];

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function jornada()
    {
        return $this->belongsTo(Jornada::class);
    }
}