import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
  ...props
}) {
  const variants = {
    // Mint / Success
    success: 'bg-[#ecfdf5] text-[#047857] border-[#d1fae5]',
    // Amber / Warning
    warning: 'bg-[#fffbeb] text-[#b45309] border-[#fef3c7]',
    // Crimson / Error
    error: 'bg-[#fef2f2] text-[#b91c1c] border-[#fee2e2]',
    // Cobalt / Primary
    primary: 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]',
    // Slate / Neutral
    neutral: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 leading-tight font-medium',
    md: 'text-xs px-2.5 py-1 leading-normal font-medium',
  };

  const defaultDotColors = {
    success: 'bg-[#10b981]',
    warning: 'bg-[#f59e0b]',
    error: 'bg-[#ef4444]',
    primary: 'bg-[#2563eb]',
    neutral: 'bg-[#94a3b8]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border select-none',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor || defaultDotColors[variant] || 'bg-[#94a3b8]'
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}