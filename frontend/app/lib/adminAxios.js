import axios from 'axios';
import { getAdminToken, removeAdminToken } from './adminAuth';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // If the request was to the login URL, DON'T redirect – let the page handle the error
    if (
      error.response?.status === 401 &&
      originalRequest?.url !== '/admin/auth/login' &&
      !window.location.pathname.includes('/admin/login')
    ) {
      removeAdminToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;