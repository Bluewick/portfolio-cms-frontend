import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Level 3 Backdrop Blur */}
      <div
        className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 border border-[#e2e8f0] shadow-level-3 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#0f172a]">{title}</h3>
            <p className="mt-1 text-sm text-[#475569] leading-relaxed">{message}</p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#0f172a] transition-colors p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant}
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}