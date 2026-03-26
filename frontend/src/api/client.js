import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE_URL });

// Keep the backend warm — ping every 14 min to prevent Render free tier cold starts
if (typeof window !== 'undefined') {
  const ping = () => axios.get(BASE_URL + '/auth/ping').catch(() => {});
  ping();
  setInterval(ping, 14 * 60 * 1000);
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

export default api;
