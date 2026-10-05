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
    default: 'bg-white border-[#E7E2DA] shadow-[0_1px_3px_rgba(20,20,22,0.03),0_8px_20px_-4px_rgba(20,20,22,0.03)]',
    subtle: 'bg-[#F4EFEA] border-[#E7E2DA]',
    flat: 'bg-white border-[#E7E2DA]',
    dark: 'bg-[#141416] text-[#FAF8F5] border-[#2A2928]',
  };

  return (
    <Component
      className={cn(
        'rounded-2xl md:rounded-3xl border p-6 md:p-8',
        variants[variant] || variants.default,
        hoverable && [
          'transition-all duration-300 ease-out',
          'hover:shadow-[0_12px_28px_-8px_rgba(20,20,22,0.07)] hover:-translate-y-0.5',
          variant === 'default' && 'hover:border-[#D6CFC4]',
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}