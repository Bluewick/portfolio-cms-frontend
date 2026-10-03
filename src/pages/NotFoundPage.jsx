import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-level-1 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">404</h2>
          <p className="text-sm font-semibold text-[#0f172a] mt-1">Page Not Found</p>
          <p className="text-xs text-[#475569] mt-1">
            The administrative view you requested does not exist or has moved.
          </p>
        </div>

        <Link to="/admin/dashboard" className="block pt-2">
          <Button variant="primary" size="md" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}