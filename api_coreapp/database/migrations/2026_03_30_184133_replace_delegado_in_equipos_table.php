<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('equipos', function (Blueprint $table) {
            $table->dropColumn('delegado_user_id');
            $table->foreignUuid('directivo_id')->nullable()->constrained('directivos')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipos', function (Blueprint $table) {
            $table->dropForeign(['directivo_id']);
            $table->dropColumn('directivo_id');
            $table->uuid('delegado_user_id')->nullable();
        });
    }
};
