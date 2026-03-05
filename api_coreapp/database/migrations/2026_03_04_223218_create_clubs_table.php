<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre')->unique();
            $table->boolean('es_club')->default(false);
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};