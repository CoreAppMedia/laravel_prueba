import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';

import Dashboard from './Components/Dashboard';
import GuiaEstilo from './Pages/GuiaEstilo';
import HomeRedirect from './Pages/HomeRedirect';
import NotFound from './Pages/NotFound';

import PanelGenerico from './Pages/PanelGenerico';
import PanelDesarrollador from './Pages/Permisos/Desarrollador/Panel';
import PanelAdmin from './Pages/Permisos/Admin/Panel';
import TemporadasIndex from './Pages/Permisos/Admin/Temporadas/Index';
import ClubesIndex from './Pages/Permisos/Admin/Clubes/Index';
import TorneosIndex from './Pages/Permisos/Admin/Torneos/Index';
import TorneoDashboard from './Pages/Permisos/Admin/Torneos/Dashboard';
import EquiposIndex from './Pages/Permisos/Admin/Equipos/Index';
import PanelPresidente from './Pages/Permisos/Presidente/Panel';
import PanelDelegado from './Pages/Permisos/Delegado/Panel';
import PanelTesorero from './Pages/Permisos/Tesorero/Panel';
import PanelSecretario from './Pages/Permisos/Secretario/Panel';
import PanelJugador from './Pages/Permisos/Jugador/Panel';
import PanelEntrenador from './Pages/Permisos/Entrenador/Panel';
import PanelArbitro from './Pages/Permisos/Arbitro/Panel';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas Públicas de Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    <Route path="/recuperar" element={<ForgotPassword />} />
                    <Route path="/restablecer" element={<ResetPassword />} />

                    {/* Rutas Protegidas (Panel Administrativo) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/panel" element={<Dashboard />} />
                        <Route path="/panel/desarrollador" element={<PanelDesarrollador />} />
                        <Route path="/panel/admin" element={<PanelAdmin />} />
                        <Route path="/panel/admin/temporadas" element={<TemporadasIndex />} />
                        <Route path="/panel/admin/clubes" element={<ClubesIndex />} />
                        <Route path="/panel/admin/torneos" element={<TorneosIndex />} />
                        <Route path="/panel/admin/torneos/:id" element={<TorneoDashboard />} />
                        <Route path="/panel/admin/equipos" element={<EquiposIndex />} />
                        <Route path="/panel/presidente" element={<PanelPresidente />} />
                        <Route path="/panel/delegado" element={<PanelDelegado />} />
                        <Route path="/panel/tesorero" element={<PanelTesorero />} />
                        <Route path="/panel/secretario" element={<PanelSecretario />} />
                        <Route path="/panel/jugador" element={<PanelJugador />} />
                        <Route path="/panel/entrenador" element={<PanelEntrenador />} />
                        <Route path="/panel/arbitro" element={<PanelArbitro />} />
                    </Route>

                    {/* Otras rutas */}
                    <Route path="/guia-estilo" element={<GuiaEstilo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const app = document.getElementById('app');

if (app) {
    const root = createRoot(app);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
