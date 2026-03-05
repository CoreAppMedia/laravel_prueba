<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('temporadas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre')->unique();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->boolean('activa')->default(false);
            $table->timestampsTz();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('temporadas');
    }
};