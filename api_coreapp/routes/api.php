<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Middleware\EnsureRegistrationKey;
use App\Http\Middleware\CheckSuperAdmin;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\CanchaController;

Route::post('/register', [AuthController::class , 'register'])->middleware([EnsureRegistrationKey::class , 'throttle:register']);
Route::post('/login', [AuthController::class , 'login'])->middleware('throttle:login');
Route::post('/forgot-password', [PasswordResetController::class , 'sendResetLink'])->middleware('throttle:password');
Route::post('/reset-password', [PasswordResetController::class , 'reset'])->middleware('throttle:password');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class , 'user']);
    Route::post('/logout', [AuthController::class , 'logout']);

    Route::middleware('admin_or_dev')->group(function () {
        Route::get('/users', [UserController::class , 'index']);
        Route::put('/users/{id}', [UserController::class , 'update']);
        Route::put('/users/{id}/password', [UserController::class , 'changePassword']);
        Route::patch('/users/{id}/status', [UserController::class , 'toggleStatus']);
        Route::delete('/users/{id}', [UserController::class , 'destroy']);
    });

        // Phase 1 Controllers
        Route::middleware('can:temporadas.view')->group(function () {
            Route::get('temporadas', [\App\Http\Controllers\TemporadaController::class , 'index']);
            Route::get('temporadas/{temporada}', [\App\Http\Controllers\TemporadaController::class , 'show']);
        }
        );
        Route::middleware('can:temporadas.create')->group(function () {
            Route::post('temporadas', [\App\Http\Controllers\TemporadaController::class , 'store']);
            Route::put('temporadas/{temporada}', [\App\Http\Controllers\TemporadaController::class , 'update']);
            Route::patch('temporadas/{temporada}', [\App\Http\Controllers\TemporadaController::class , 'update']);
            Route::delete('temporadas/{temporada}', [\App\Http\Controllers\TemporadaController::class , 'destroy']);
        }
        );

        Route::middleware('can:torneos.view')->group(function () {
            Route::get('torneos', [\App\Http\Controllers\TorneoController::class , 'index']);
            Route::get('torneos/{torneo}', [\App\Http\Controllers\TorneoController::class , 'show']);
        }
        );
        Route::middleware('can:torneos.create')->group(function () {
            Route::post('torneos', [\App\Http\Controllers\TorneoController::class , 'store']);
            Route::put('torneos/{torneo}', [\App\Http\Controllers\TorneoController::class , 'update']);
            Route::delete('torneos/{torneo}', [\App\Http\Controllers\TorneoController::class , 'destroy']);
        }
        );

        Route::middleware('can:clubs.view')->group(function () {
            Route::get('clubs', [\App\Http\Controllers\ClubController::class , 'index']);
            Route::get('clubs/{club}', [\App\Http\Controllers\ClubController::class , 'show']);
        }
        );
        Route::middleware('can:clubs.create')->group(function () {
            Route::post('clubs', [\App\Http\Controllers\ClubController::class , 'store']);
            Route::put('clubs/{club}', [\App\Http\Controllers\ClubController::class , 'update']);
            Route::delete('clubs/{club}', [\App\Http\Controllers\ClubController::class , 'destroy']);
        }
        );

        Route::middleware('can:equipos.view')->group(function () {
            Route::get('equipos', [\App\Http\Controllers\EquipoController::class , 'index']);
            Route::get('equipos/{equipo}', [\App\Http\Controllers\EquipoController::class , 'show']);
        }
        );
        Route::middleware('can:equipos.create')->group(function () {
            Route::post('equipos', [\App\Http\Controllers\EquipoController::class , 'store']);
            Route::put('equipos/{equipo}', [\App\Http\Controllers\EquipoController::class , 'update']);
            Route::delete('equipos/{equipo}', [\App\Http\Controllers\EquipoController::class , 'destroy']);
            Route::patch('/equipos/{equipo}/status', [\App\Http\Controllers\EquipoController::class , 'toggleStatus']);
        }
        );

        // Canchas Catalog
        Route::middleware('can:*.view')->group(function () {
            Route::get('/canchas', [CanchaController::class, 'index']);
            Route::post('/canchas', [CanchaController::class, 'store']);
            Route::get('/canchas/{cancha}', [CanchaController::class, 'show']);
            Route::put('/canchas/{cancha}', [CanchaController::class, 'update']);
            Route::delete('/canchas/{cancha}', [CanchaController::class, 'destroy']);
            
            // Cancha Horarios setup
            Route::post('/canchas/{cancha}/horarios', [CanchaController::class, 'storeHorario']);
            Route::delete('/canchas/horarios/{horario}', [CanchaController::class, 'destroyHorario']);
        });

        // Phase 2 Controllers
        Route::middleware('can:torneos.create')->group(function () {
            // Inscripciones a torneos
            Route::post('torneos/{torneo}/inscribir', [\App\Http\Controllers\Api\EquipoTorneoController::class, 'inscribirEquipo']);
            Route::patch('torneos/{torneo}/equipos/{equipo}/pago', [\App\Http\Controllers\Api\EquipoTorneoController::class, 'registrarPago']);
            Route::get('torneos/{torneo}/equipos-inscritos', [\App\Http\Controllers\Api\EquipoTorneoController::class, 'obtenerEquiposInscritos']);

            // Gestión de Jornadas
            Route::post('torneos/{torneo}/jornadas', [\App\Http\Controllers\Api\JornadaController::class, 'store']);
            Route::get('torneos/{torneo}/jornadas', [\App\Http\Controllers\Api\JornadaController::class, 'indexByTorneo']);
            Route::patch('jornadas/{jornada}/cerrar', [\App\Http\Controllers\Api\JornadaController::class, 'cerrarJornada']);
            Route::patch('jornadas/{jornada}/suspender', [\App\Http\Controllers\Api\JornadaController::class, 'suspender']);
            Route::patch('jornadas/{jornada}/reactivar', [\App\Http\Controllers\Api\JornadaController::class, 'reactivar']);
            Route::delete('jornadas/{jornada}', [\App\Http\Controllers\Api\JornadaController::class, 'destroy']);

            // Gestión de Partidos
            Route::post('jornadas/{jornada}/partidos', [\App\Http\Controllers\Api\PartidoController::class, 'store']);
            Route::patch('partidos/{partido}/resultado', [\App\Http\Controllers\Api\PartidoController::class, 'registrarResultado']);
            Route::patch('partidos/{partido}/cerrar', [\App\Http\Controllers\Api\PartidoController::class, 'cerrarPartido']);
            Route::patch('partidos/{partido}/suspender', [\App\Http\Controllers\Api\PartidoController::class, 'suspenderPartido']);
            Route::patch('partidos/{partido}/reactivar', [\App\Http\Controllers\Api\PartidoController::class, 'reactivarPartido']);

            // Phase 3: Árbitros y Pagos
            Route::apiResource('arbitros', \App\Http\Controllers\Api\ArbitroController::class);
            Route::post('partidos/{partido}/arbitros', [\App\Http\Controllers\Api\PartidoArbitroController::class, 'asignar']);
            Route::delete('partidos/{partido}/arbitros/{arbitro}', [\App\Http\Controllers\Api\PartidoArbitroController::class, 'desasignar']);
            Route::patch('partido-arbitro/{id}/pago', [\App\Http\Controllers\Api\PartidoArbitroController::class, 'registrarPago']);

            // Torneo - Arbitro assignment
            Route::get('torneos/{torneo}/arbitros', [\App\Http\Controllers\Api\TorneoArbitroController::class, 'obtenerArbitrosTorneo']);
            Route::post('torneos/{torneo}/arbitros', [\App\Http\Controllers\Api\TorneoArbitroController::class, 'inscribirArbitro']);
            Route::delete('torneos/{torneo}/arbitros/{arbitro}', [\App\Http\Controllers\Api\TorneoArbitroController::class, 'desinscribirArbitro']);
        });

        // Catalogos
        Route::prefix('catalogos')->middleware('can:*.view')->group(function () {
            Route::get('/tipos-torneo', [\App\Http\Controllers\CatalogosController::class , 'getTiposTorneo']);
            Route::get('/categorias', [\App\Http\Controllers\CatalogosController::class , 'getCategorias']);
            Route::get('/estados-partido', [\App\Http\Controllers\CatalogosController::class , 'getEstadosPartido']);
            Route::get('/tipos-multa', [\App\Http\Controllers\CatalogosController::class , 'getTiposMulta']);
        }
        );
    });

Route::get('/test', function () {
    return response()->json(['status' => 'ok', 'message' => 'API CoreAppMedia esta correcto']);
});