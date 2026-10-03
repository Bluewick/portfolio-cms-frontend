import React from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export const Button = React.forwardRef(function Button(
  {
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed focus-halo';

  const variants = {
    primary:
      'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-sm',
    secondary:
      'bg-[#0f172a] text-white hover:bg-[#1e293b] active:bg-[#334155] shadow-sm',
    outline:
      'bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:bg-[#f1f5f9] shadow-level-1',
    ghost:
      'bg-transparent text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] active:bg-[#e2e8f0]',
    danger:
      'bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-sm',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});