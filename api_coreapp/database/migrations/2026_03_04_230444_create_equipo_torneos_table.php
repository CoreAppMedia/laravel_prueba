<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('equipo_torneo', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('equipo_id')
                ->constrained('equipos')
                ->cascadeOnDelete();

            $table->foreignUuid('torneo_id')
                ->constrained('torneos')
                ->cascadeOnDelete();

            $table->timestampTz('fecha_inscripcion');
            $table->boolean('pagado_inscripcion')->default(false);

            $table->timestampsTz();

            $table->unique(['equipo_id', 'torneo_id']);
            $table->index('torneo_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipo_torneo');
    }
};