import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronUp, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close flyout on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Level 2 Elevation Flyout Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 bg-white border border-[#e2e8f0] rounded-xl shadow-level-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-2.5 border-b border-[#f1f5f9] mb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0f172a] truncate max-w-[140px]">
                {user?.email || 'admin@email.com'}
              </span>
              <Badge variant="success" size="sm">PRO</Badge>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Primary Administrator</p>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/admin/about');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-[#94a3b8]" />
              Profile Settings
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8]" />
                Live Portfolio
              </div>
              <span className="text-[10px] text-[#94a3b8]">Open</span>
            </a>
          </div>

          <div className="my-1 border-t border-[#f1f5f9]" />

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}

      {/* Collapsed User Profile Card */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-2 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition-colors group text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold text-xs shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0f172a] truncate">
              {user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-[11px] text-[#94a3b8] truncate">
              {user?.email || 'admin@email.com'}
            </p>
          </div>
        </div>
        <ChevronUp
          className={`w-4 h-4 text-[#94a3b8] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}