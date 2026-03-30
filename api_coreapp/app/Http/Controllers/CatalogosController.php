<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CatalogoTipoTorneo;
use App\Models\CatalogoCategoria;
use App\Models\CatalogoEstadoPartido;
use App\Models\CatalogoTipoMulta;
use App\Models\CatalogoTipoDueno;

class CatalogosController extends Controller
{
    /**
     * Obtener tipos de torneos activos.
     */
    public function getTiposTorneo()
    {
        return response()->json(CatalogoTipoTorneo::where('activo', true)->get());
    }

    /**
     * Obtener categorías activas.
     */
    public function getCategorias()
    {
        return response()->json(CatalogoCategoria::where('activo', true)->get());
    }

    /**
     * Obtener estados de partidos activos.
     */
    public function getEstadosPartido()
    {
        return response()->json(CatalogoEstadoPartido::where('activo', true)->get());
    }

    /**
     * Obtener tipos de multas activos.
     */
    public function getTiposMulta()
    {
        return response()->json(CatalogoTipoMulta::where('activo', true)->get());
    }

    /**
     * Obtener tipos de dueños (ej: Dueño, Delegado) activos.
     */
    public function getTiposDuenos()
    {
        return response()->json(CatalogoTipoDueno::where('activo', true)->get());
    }
}
