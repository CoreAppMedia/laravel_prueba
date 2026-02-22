import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen';
import { useAuth } from '../Auth/AuthContext';
import { getHomePathForUser } from '../lib/permissions';

export default function HomeRedirect() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        navigate(getHomePathForUser(user), { replace: true });
    }, [user, isLoading, navigate]);

    return <LoadingScreen label="Entrando a tu panel..." />;
}
