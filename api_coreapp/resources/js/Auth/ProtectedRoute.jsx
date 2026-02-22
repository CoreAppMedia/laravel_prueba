import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) return <LoadingScreen label="Validando tu sesión..." />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
}
