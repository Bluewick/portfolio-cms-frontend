import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Level 3 Backdrop Blur */}
      <div
        className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Shell */}
      <div
        className={cn(
          'relative bg-white w-full rounded-xl border border-[#e2e8f0] shadow-level-3 z-10 animate-in fade-in zoom-in-95 duration-150 my-8 overflow-hidden',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">{title}</h3>
            {description && (
              <p className="text-xs text-[#475569] mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#0f172a] p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[calc(100vh-14rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}