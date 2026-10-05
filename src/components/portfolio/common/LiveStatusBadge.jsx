import React from 'react';
import { cn } from '../../../lib/utils';

export function LiveStatusBadge({
  text = 'Available for software roles & consulting',
  className,
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5',
        'bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d]',
        'text-xs md:text-[13px] font-medium tracking-tight',
        'shadow-xs',
        className
      )}
      role="status"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
      </span>
      <span>{text}</span>
    </div>
  );
}