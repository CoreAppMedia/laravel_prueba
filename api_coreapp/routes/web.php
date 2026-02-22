<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard');
});

Route::view('/{any}', 'dashboard')->where('any', '^(?!api).*$');



