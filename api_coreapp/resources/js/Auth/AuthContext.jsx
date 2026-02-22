import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, fetchMe, getToken, login as apiLogin, logout as apiLogout } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const me = await fetchMe();
            setUser(me);
        } catch (e) {
            clearToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const signIn = useCallback(async ({ email, password }) => {
        const data = await apiLogin({ email, password });
        setUser(data?.user || null);
        return data;
    }, []);

    const signOut = useCallback(async () => {
        await apiLogout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        isLoading,
        refresh,
        signIn,
        signOut,
        isAuthenticated: Boolean(user),
    }), [user, isLoading, refresh, signIn, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
}
