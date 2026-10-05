import React from 'react';
import { cn } from '../../../lib/utils';

export function TactileCard({
  children,
  as: Component = 'div',
  hoverable = true,
  variant = 'default',
  className,
  ...props
}) {
  const variants = {
    default: 'bg-white border-slate-200',
    subtle: 'bg-slate-50/70 border-slate-200',
    dark: 'bg-[#0f172a] text-white border-slate-800',
  };

  return (
    <Component
      className={cn(
        'rounded-2xl md:rounded-3xl border p-6 md:p-8',
        'shadow-tactile-card',
        variants[variant] || variants.default,
        hoverable && [
          'transition-all duration-200 ease-out',
          'hover:shadow-tactile-hover hover:-translate-y-0.5',
          variant === 'default' && 'hover:border-slate-300',
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}