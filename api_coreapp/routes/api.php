<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Middleware\EnsureRegistrationKey;
use App\Http\Middleware\CheckSuperAdmin;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register'])->middleware(EnsureRegistrationKey::class);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware(CheckSuperAdmin::class)->group(function () {
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::put('/users/{id}/password', [UserController::class, 'changePassword']);
        Route::patch('/users/{id}/status', [UserController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});

Route::get('/test', function () {
    return response()->json(['status' => 'ok', 'message' => 'API CoreAppMedia esta correcto']);
});
