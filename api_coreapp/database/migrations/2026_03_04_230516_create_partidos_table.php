<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('partidos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('jornada_id')
                ->constrained('jornadas')
                ->cascadeOnDelete();

            $table->foreignUuid('equipo_local_id')
                ->constrained('equipos')
                ->restrictOnDelete();

            $table->foreignUuid('equipo_visitante_id')
                ->constrained('equipos')
                ->restrictOnDelete();

            $table->foreignUuid('estado_partido_id')
                ->constrained('catalogo_estados_partido')
                ->restrictOnDelete();

            $table->timestampTz('fecha');

            $table->integer('goles_local')->nullable();
            $table->integer('goles_visitante')->nullable();

            $table->boolean('cerrado')->default(false);

            $table->timestampsTz();


            $table->unique([
                'jornada_id',
                'equipo_local_id',
                'equipo_visitante_id'
            ]);

            $table->index('equipo_local_id');
            $table->index('equipo_visitante_id');
            $table->index('estado_partido_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partidos');
    }
};