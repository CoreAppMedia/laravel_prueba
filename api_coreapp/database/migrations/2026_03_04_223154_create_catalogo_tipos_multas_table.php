<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('catalogo_tipos_multa', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre')->unique();
            $table->text('descripcion')->nullable();
            $table->boolean('es_economica')->default(true);
            $table->decimal('monto_default', 12, 2)->default(0);
            $table->boolean('activo')->default(true);
            $table->timestampsTz();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalogo_tipos_multa');
    }
};
