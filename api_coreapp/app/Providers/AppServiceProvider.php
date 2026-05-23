<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;   // ← IMPORT NECESARIO
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->input('email');
            return Limit::perMinute(10)->by($email.$request->ip());
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password', function (Request $request) {
            $email = (string) $request->input('email');
            return Limit::perMinute(5)->by($email.$request->ip());
        });

        // Registrar Observers para Auditoría
        \App\Models\User::observe(\App\Observers\AuditObserver::class);
        \App\Models\Temporada::observe(\App\Observers\AuditObserver::class);
        \App\Models\Club::observe(\App\Observers\AuditObserver::class);
        \App\Models\Torneo::observe(\App\Observers\AuditObserver::class);
        \App\Models\Equipo::observe(\App\Observers\AuditObserver::class);
        \App\Models\Directivo::observe(\App\Observers\AuditObserver::class);
        \App\Models\Egreso::observe(\App\Observers\AuditObserver::class);
        \App\Models\Ingreso::observe(\App\Observers\AuditObserver::class);
        \App\Models\Multa::observe(\App\Observers\AuditObserver::class);
    }
}