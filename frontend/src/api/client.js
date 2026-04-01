import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// Keep the backend warm — ping every 10 min to prevent Render free tier cold starts
if (typeof window !== 'undefined') {
  const ping = () => axios.get(BASE_URL + '/auth/ping').catch(() => {});
  ping();
  setInterval(ping, 10 * 60 * 1000);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('slayit_token');
  const url = config.url || '';
  const isAuthRoute = url.includes('/auth/signup') || url.includes('/auth/login');

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers && config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

// On 401 — token expired or invalid — clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthRoute = url.includes('/auth/signup') || url.includes('/auth/login');
      if (!isAuthRoute) {
        localStorage.removeItem('slayit_token');
        localStorage.removeItem('slayit_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
