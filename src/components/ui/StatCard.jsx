import React from 'react';
import { cn } from '../../lib/utils';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'success',
  className = '',
}) {
  const badgeStyles = {
    success: 'bg-[#ecfdf5] text-[#047857]',
    warning: 'bg-[#fffbeb] text-[#b45309]',
    primary: 'bg-[#eff6ff] text-[#1d4ed8]',
    neutral: 'bg-[#f1f5f9] text-[#475569]',
  };

  return (
    <div
      className={cn(
        'p-5 bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 flex flex-col justify-between space-y-3 transition-all hover:border-[#cbd5e1]',
        className
      )}
    >
      {/* Top Row: Metric Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#2563eb]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Metric Value */}
      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">
          {value}
        </div>

        {/* Subtitle / Contextual Tag */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {badgeText && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[11px] font-semibold select-none',
                badgeStyles[badgeVariant] || badgeStyles.neutral
              )}
            >
              {badgeText}
            </span>
          )}
          {subtitle && <span className="text-[#94a3b8]">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}