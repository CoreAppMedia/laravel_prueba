<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jornadas', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('torneo_id')
                ->constrained('torneos')
                ->cascadeOnDelete();

            $table->integer('numero');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->boolean('cerrada')->default(false);

            $table->timestampsTz();

            $table->unique(['torneo_id', 'numero']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jornadas');
    }
};