
import React from 'react';
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                  boxShadow:
                    '0px 12px 24px -4px rgba(15, 23, 42, 0.08), 0px 4px 6px -2px rgba(15, 23, 42, 0.03)',
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;