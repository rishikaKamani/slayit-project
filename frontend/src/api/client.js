import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

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
