<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AuditLog extends Model
{
    use HasUuids;

    protected $table = 'audit_logs';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'accion',
        'modelo_tipo',
        'modelo_id',
        'valores_viejos',
        'valores_nuevos',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'valores_viejos' => 'array',
        'valores_nuevos' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
