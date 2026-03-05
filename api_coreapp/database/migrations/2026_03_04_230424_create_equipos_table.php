<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('club_id')
                ->constrained('clubs')
                ->restrictOnDelete();

            $table->foreignUuid('categoria_id')
                ->constrained('catalogo_categorias')
                ->restrictOnDelete();

            $table->string('nombre_mostrado');
            $table->uuid('delegado_user_id')->nullable();

            $table->boolean('activo')->default(true);

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique(['club_id', 'categoria_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};