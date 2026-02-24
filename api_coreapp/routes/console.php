<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('password-reset-codes:prune', function () {
    $ttlMinutes = (int) env('PASSWORD_RESET_CODE_TTL_MINUTES', 15);

    if ($ttlMinutes <= 0) {
        $this->info('PASSWORD_RESET_CODE_TTL_MINUTES <= 0, no se realizará limpieza.');
        return;
    }

    $deleted = DB::table('password_reset_codes')
        ->where('created_at', '<', now()->subMinutes($ttlMinutes))
        ->delete();

    $this->info("Registros eliminados: {$deleted}");
})->purpose('Elimina códigos de restablecimiento de contraseña expirados');

Schedule::command('password-reset-codes:prune')->hourly();
