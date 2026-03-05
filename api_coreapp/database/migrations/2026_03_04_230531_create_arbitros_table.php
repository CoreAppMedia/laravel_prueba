<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('arbitros', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre');
            $table->string('telefono')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arbitros');
    }
};