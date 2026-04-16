<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/login', 'dashboard')->name('login');
Route::view('/registro', 'dashboard')->name('register');

Route::view('/{any}', 'dashboard')->where('any', '^(?!api).*$');



