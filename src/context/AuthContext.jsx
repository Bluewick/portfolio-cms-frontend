import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY, setOnUnauthorizedCallback } from '../lib/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Hook 401 interceptor callback to trigger context logout
  useEffect(() => {
    setOnUnauthorizedCallback(logout);
  }, [logout]);

  // Verify active session on initial app mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      const activeToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!activeToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/admin/auth/me');
        if (response.data?.success && response.data?.data?.admin) {
          const adminProfile = response.data.data.admin;
          if (isMounted) {
            setUser(adminProfile);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminProfile));
          }
        }
      } catch (err) {
        // If the token is invalid, clear stale credentials
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (email, password) => {
    const response = await api.post('/api/admin/auth/login', { email, password });
    
    if (response.data?.success && response.data?.data) {
      const { admin, token: jwtToken } = response.data.data;
      
      localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(admin));

      setToken(jwtToken);
      setUser(admin);

      return response.data;
    }

    throw new Error(response.data?.message || 'Authentication failed');
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}