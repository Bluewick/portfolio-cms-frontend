import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    type = 'text',
    className = '',
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#475569] uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full h-10 px-3.5 text-sm bg-white text-[#0f172a] rounded-lg border transition-all duration-150',
            'placeholder:text-[#94a3b8] focus-halo',
            error
              ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10'
              : 'border-[#e2e8f0]',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94a3b8]">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-[#ef4444] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#94a3b8]">{helperText}</p>
      ) : null}
    </div>
  );
});