<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ingreso extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'ingresos';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'torneo_id',
        'jornada_id',
        'concepto',
        'categoria',
        'monto',
        'fecha',
        'payable_id',
        'payable_type',
        'metodo_pago',
        'comprobante_url',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha' => 'datetime',
    ];

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function payable()
    {
        return $this->morphTo();
    }
}