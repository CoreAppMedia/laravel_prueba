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
        Schema::table('ingresos', function (Blueprint $table) {
            if (!Schema::hasColumn('ingresos', 'payable_id')) {
                $table->nullableUuidMorphs('payable');
            }
            if (!Schema::hasColumn('ingresos', 'metodo_pago')) {
                $table->string('metodo_pago')->nullable()->default('Efectivo')->after('monto');
            }
            if (!Schema::hasColumn('ingresos', 'comprobante_url')) {
                $table->string('comprobante_url')->nullable()->after('metodo_pago');
            }
            if (!Schema::hasColumn('ingresos', 'deleted_at')) {
                $table->softDeletesTz();
            }
        });

        Schema::table('egresos', function (Blueprint $table) {
            if (!Schema::hasColumn('egresos', 'payable_id')) {
                $table->nullableUuidMorphs('payable');
            }
            if (!Schema::hasColumn('egresos', 'metodo_pago')) {
                $table->string('metodo_pago')->nullable()->default('Efectivo')->after('monto');
            }
            if (!Schema::hasColumn('egresos', 'comprobante_url')) {
                $table->string('comprobante_url')->nullable()->after('metodo_pago');
            }
            if (!Schema::hasColumn('egresos', 'deleted_at')) {
                $table->softDeletesTz();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingresos', function (Blueprint $table) {
            $table->dropMorphs('payable');
            $table->dropColumn(['metodo_pago', 'comprobante_url']);
            $table->dropSoftDeletesTz();
        });

        Schema::table('egresos', function (Blueprint $table) {
            $table->dropMorphs('payable');
            $table->dropColumn(['metodo_pago', 'comprobante_url']);
            $table->dropSoftDeletesTz();
        });
    }
};
