<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles'; // Explicitly set table name since we renamed it (Establece explícitamente el nombre de la tabla ya que lo renombramos)
    protected $fillable = ['nombre'];
}
