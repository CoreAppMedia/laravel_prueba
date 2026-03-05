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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('accion'); // Crear, Actualizar, Eliminar...
            $table->string('modelo_tipo')->nullable(); // Ej: App\Models\Equipo
            $table->uuid('modelo_id')->nullable(); 

            $table->json('valores_viejos')->nullable();
            $table->json('valores_nuevos')->nullable();

            $table->string('ip')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
