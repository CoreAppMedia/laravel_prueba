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
import PanelAdminOverview from './Pages/Permisos/Admin/Panel';
import AdminLayout from './Layouts/AdminLayout';
import TemporadasIndex from './Pages/Permisos/Admin/Temporadas/Index';
import ClubesIndex from './Pages/Permisos/Admin/Clubes/Index';
import TorneosIndex from './Pages/Permisos/Admin/Torneos/Index';
import TorneoDashboard from './Pages/Permisos/Admin/Torneos/Dashboard';
import EquiposIndex from './Pages/Permisos/Admin/Equipos/Index';
import CanchasContent from './Pages/Permisos/Admin/Canchas/CanchasContent';
import ArbitrosContent from './Pages/Permisos/Admin/Torneos/ArbitrosContent';
import UsersContent from './Pages/Permisos/Admin/Users/UsersContent';
import FinanzasContent from './Pages/Permisos/Admin/Finanzas/FinanzasContent';
import DirectivosContent from './Pages/Permisos/Admin/Directivos/DirectivosContent';
import RolDeJuegoContent from './Pages/Permisos/Admin/RolDeJuego/RolDeJuegoContent';
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
                        <Route path="/panel/admin" element={<AdminLayout />}>
                            <Route index element={<PanelAdminOverview />} />
                            <Route path="temporadas" element={<TemporadasIndex />} />
                            <Route path="clubes" element={<ClubesIndex />} />
                            <Route path="torneos" element={<TorneosIndex />} />
                            <Route path="equipos" element={<EquiposIndex />} />
                            <Route path="canchas" element={<CanchasContent />} />
                            <Route path="arbitros" element={<ArbitrosContent />} />
                            <Route path="finanzas" element={<FinanzasContent />} />
                            <Route path="directivos" element={<DirectivosContent />} />
                            <Route path="rol-de-juego" element={<RolDeJuegoContent />} />
                            <Route path="users" element={<UsersContent />} />
                            <Route path="torneos/:id" element={<TorneoDashboard />} />
                        </Route>
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
