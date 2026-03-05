<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('multas', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('equipo_id')
                ->constrained('equipos')
                ->restrictOnDelete();

            $table->foreignUuid('partido_id')
                ->nullable()
                ->constrained('partidos')
                ->nullOnDelete();

            $table->foreignUuid('torneo_id')
                ->constrained('torneos')
                ->restrictOnDelete();

            $table->foreignUuid('tipo_multa_id')
                ->constrained('catalogo_tipos_multa')
                ->restrictOnDelete();

            $table->string('motivo');
            $table->decimal('monto', 12, 2);

            $table->boolean('pagada')->default(false);
            $table->timestampTz('fecha')->useCurrent();

            $table->timestampsTz();
            $table->softDeletesTz();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multas');
    }
};