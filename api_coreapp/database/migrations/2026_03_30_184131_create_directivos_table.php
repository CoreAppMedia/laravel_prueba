<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('directivos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->string('correo_electronico')->nullable();
            $table->foreignUuid('catalogo_tipo_dueno_id')->constrained('catalogo_tipo_duenos')->restrictOnDelete();
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directivos');
    }
};
