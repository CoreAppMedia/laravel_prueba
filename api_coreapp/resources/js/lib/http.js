import axios from 'axios';

const http = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default http;
