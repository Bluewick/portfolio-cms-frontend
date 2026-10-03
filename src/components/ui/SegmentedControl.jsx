import React from 'react';
import { cn } from '../../lib/utils';

export function SegmentedControl({
  options = [],
  value,
  onChange,
  className = '',
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-7 px-3 text-xs rounded-md font-medium transition-all duration-150 select-none flex items-center gap-1.5',
              isSelected
                ? 'bg-white text-[#0f172a] shadow-level-1 font-semibold'
                : 'text-[#64748b] hover:text-[#0f172a]'
            )}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isSelected
                    ? 'bg-[#eff6ff] text-[#2563eb]'
                    : 'bg-[#e2e8f0] text-[#64748b]'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}