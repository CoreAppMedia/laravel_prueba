<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('partido_arbitro', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('partido_id')
                ->constrained('partidos')
                ->cascadeOnDelete();

            $table->foreignUuid('arbitro_id')
                ->constrained('arbitros')
                ->restrictOnDelete();

            $table->string('rol'); // central, asistente, cuarto
            $table->decimal('pago', 10, 2)->default(0);
            $table->boolean('pagado')->default(false);

            $table->timestampsTz();

            $table->unique(['partido_id', 'arbitro_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partido_arbitro');
    }
};