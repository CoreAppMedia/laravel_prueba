<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Partido;
use Illuminate\Support\Carbon;

$fecha = '2026-05-03'; 
$partidos = Partido::with([
    'equipoLocal', 
    'equipoVisitante', 
    'jornada.torneo', 
    'cancha', 
    'canchaHorario'
])
->whereDate('fecha', $fecha)
->get();

header('Content-Type: application/json');
echo json_encode($partidos->toArray(), JSON_PRETTY_PRINT);
