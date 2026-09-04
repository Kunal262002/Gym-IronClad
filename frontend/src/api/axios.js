import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://gym-ironclad.onrender.com';
const apiBaseUrl = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/$/, '')
  : `${configuredApiUrl.replace(/\/$/, '')}/api`;

// Central axios instance so the base URL and auth header logic live in one place.
const api = axios.create({
  baseURL: apiBaseUrl,
});

// Attach the stored JWT (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
