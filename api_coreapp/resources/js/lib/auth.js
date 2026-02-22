import http from './http';

export function getToken() {
    return localStorage.getItem('auth_token');
}

export function setToken(token) {
    localStorage.setItem('auth_token', token);
}

export function clearToken() {
    localStorage.removeItem('auth_token');
}

export async function fetchMe() {
    const { data } = await http.get('/api/user');
    return data;
}

export async function login({ email, password }) {
    const { data } = await http.post('/api/login', { email, password });

    if (data?.access_token) {
        setToken(data.access_token);
    }

    return data;
}

export async function logout() {
    try {
        await http.post('/api/logout');
    } finally {
        clearToken();
    }
}

export async function forgotPassword({ email }) {
    const { data } = await http.post('/api/forgot-password', { email });
    return data;
}

export async function resetPassword({ email, token, password, password_confirmation }) {
    const { data } = await http.post('/api/reset-password', {
        email,
        token,
        password,
        password_confirmation,
    });

    return data;
}
