import axios from 'axios';
import { toast } from 'sonner';

export const TOKEN_STORAGE_KEY = 'portfolio_cms_token';
export const USER_STORAGE_KEY = 'portfolio_cms_user';

// Access API URL via environment variable with fallback
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5515';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Centralized event listener callback for 401s (avoiding circular dependency with Router)
let onUnauthorizedCallback = null;

export const setOnUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401 && !currentPath.includes('/admin/login')) {
      // Purge local storage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      toast.error('Session expired. Please sign in again.');

      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      } else {
        window.location.href = `/admin/login?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    }

    return Promise.reject(error);
  }
);