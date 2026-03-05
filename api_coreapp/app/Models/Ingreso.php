<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Ingreso extends Model
{
    use HasUuids;

    protected $table = 'ingresos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'torneo_id',
        'concepto',
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
}