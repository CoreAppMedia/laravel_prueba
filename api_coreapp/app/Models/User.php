<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Modelo de usuario que extiende de Authenticatable.
 * (User model that extends Authenticatable.)
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, \Laravel\Sanctum\HasApiTokens;

    /**
     * The attributes that are mass assignable. (Los atributos que son asignables en masa.)
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'permiso_id',
        'rol_id',
        'active',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'asignado',
    ];

    public function permiso()
    {
        return $this->belongsTo(Permiso::class);
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class);
    }

    /**
     * The attributes that should be hidden for serialization. (Los atributos que deben ser ocultos para la serialización.)
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast. (Obtener los atributos que deben ser convertidos.)
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
            'asignado' => 'array',
        ];
    }
}
