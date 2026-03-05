<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('torneos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('temporada_id')
                ->constrained('temporadas')
                ->restrictOnDelete();

            $table->foreignUuid('tipo_torneo_id')
                ->constrained('catalogo_tipos_torneo')
                ->restrictOnDelete();

            $table->string('nombre');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');

            $table->boolean('es_abierto')->default(false);
            $table->decimal('costo_inscripcion', 12, 2)->default(0);
            $table->decimal('costo_arbitraje_por_partido', 12, 2)->default(0);

            $table->string('estatus')->default('configuracion');

            $table->timestampsTz();


            $table->unique(['temporada_id', 'nombre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('torneos');
    }
};