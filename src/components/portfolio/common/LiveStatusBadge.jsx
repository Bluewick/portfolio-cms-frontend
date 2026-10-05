import React from 'react';
import { cn } from '../../../lib/utils';

export function LiveStatusBadge({
  text = 'Available for Q4 contracts & technical advisory',
  className,
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5',
        'bg-[#DCFCE7]/70 border border-[#86EFAC]/60 text-[#15803D]',
        'text-xs font-mono font-medium tracking-tight',
        'shadow-xs',
        className
      )}
      role="status"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
      </span>
      <span>{text}</span>
    </div>
  );
}