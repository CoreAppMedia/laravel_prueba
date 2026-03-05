<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Multa extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'multas';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'equipo_id',
        'partido_id',
        'torneo_id',
        'tipo_multa_id',
        'motivo',
        'monto',
        'pagada',
        'fecha',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'pagada' => 'boolean',
        'fecha' => 'datetime',
    ];

    public function equipo()
    {
        return $this->belongsTo(Equipo::class);
    }

    public function partido()
    {
        return $this->belongsTo(Partido::class);
    }

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function tipoMulta()
    {
        return $this->belongsTo(CatalogoTipoMulta::class, 'tipo_multa_id');
    }
}