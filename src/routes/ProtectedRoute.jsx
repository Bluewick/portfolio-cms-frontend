import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" className="text-[#2563eb]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Authenticating Workspace...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/admin/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}