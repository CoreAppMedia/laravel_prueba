<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PartidoArbitro extends Pivot
{
    use HasUuids;

    protected $table = 'partido_arbitro';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'partido_id',
        'arbitro_id',
        'rol',
        'pago',
        'pagado',
    ];

    protected $casts = [
        'pago' => 'decimal:2',
        'pagado' => 'boolean',
    ];
}