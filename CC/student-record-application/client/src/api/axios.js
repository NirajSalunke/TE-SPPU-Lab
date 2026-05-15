import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('srms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 → clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('srms_token');
      localStorage.removeItem('srms_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
