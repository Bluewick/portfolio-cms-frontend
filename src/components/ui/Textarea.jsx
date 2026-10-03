import React from 'react';
import { cn } from '../../lib/utils';

export const Textarea = React.forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    rows = 4,
    className = '',
    ...props
  },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-[#475569] uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full p-3 text-sm bg-white text-[#0f172a] rounded-lg border transition-all duration-150',
          'placeholder:text-[#94a3b8] focus-halo resize-y',
          error
            ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10'
            : 'border-[#e2e8f0]',
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[#ef4444] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#94a3b8]">{helperText}</p>
      ) : null}
    </div>
  );
});