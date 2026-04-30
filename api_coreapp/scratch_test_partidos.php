<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Partido;
use Illuminate\Support\Carbon;

$fecha = '2026-05-03'; 
echo "Probando para fecha: $fecha\n";

$partidos = Partido::with([
    'equipoLocal', 
    'equipoVisitante', 
    'jornada.torneo', 
    'cancha', 
    'canchaHorario'
])
->whereDate('fecha', $fecha)
->get();

foreach ($partidos as $p) {
    echo "ID: " . $p->id . "\n";
    echo "Torneo: " . ($p->jornada->torneo->nombre ?? 'N/A') . "\n";
    echo "Local: " . ($p->equipo_local->nombre_mostrado ?? 'N/A') . " (Attr check: " . ($p->equipoLocal->nombre_mostrado ?? 'N/A') . ")\n";
    echo "Visita: " . ($p->equipo_visitante->nombre_mostrado ?? 'N/A') . " (Attr check: " . ($p->equipoVisitante->nombre_mostrado ?? 'N/A') . ")\n";
    echo "Cancha ID: " . $p->cancha_id . "\n";
    echo "Horario ID: " . $p->cancha_horario_id . "\n";
    echo "--------------------------\n";
}
