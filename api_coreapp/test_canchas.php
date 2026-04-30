<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Cancha;

$canchas = Cancha::whereHas('equipos.torneos', function($q) {
    $q->where('torneos.estatus', '!=', 'finalizado');
})
->with('horarios')
->get();

header('Content-Type: application/json');
echo json_encode($canchas->toArray(), JSON_PRETTY_PRINT);
