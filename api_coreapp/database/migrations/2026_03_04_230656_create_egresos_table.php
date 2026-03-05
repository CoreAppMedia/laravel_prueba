<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('egresos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('torneo_id')
                ->constrained('torneos')
                ->cascadeOnDelete();

            $table->string('concepto');
            $table->decimal('monto', 12, 2);

            $table->timestampTz('fecha')->useCurrent();

            $table->timestampsTz();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('egresos');
    }
};