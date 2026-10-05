import React from 'react';
import { cn } from '../../../lib/utils';

export function SkeletonLoader({ variant = 'card', count = 1, className }) {
  const renderItem = (idx) => {
    switch (variant) {
      case 'card':
        return (
          <div
            key={idx}
            className={cn(
              'rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-tactile-card animate-pulse space-y-4',
              className
            )}
          >
            <div className="aspect-[16/10] w-full rounded-2xl bg-slate-100" />
            <div className="h-4 w-1/4 rounded-full bg-slate-200" />
            <div className="h-6 w-3/4 rounded-md bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-md bg-slate-100" />
              <div className="h-3.5 w-5/6 rounded-md bg-slate-100" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        );

      case 'blog':
        return (
          <div
            key={idx}
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-6 shadow-tactile-card animate-pulse space-y-4',
              className
            )}
          >
            <div className="aspect-video w-full rounded-xl bg-slate-100" />
            <div className="h-3 w-1/3 rounded-full bg-slate-200" />
            <div className="h-5 w-4/5 rounded-md bg-slate-200" />
            <div className="h-3.5 w-full rounded-md bg-slate-100" />
          </div>
        );

      case 'timeline':
        return (
          <div
            key={idx}
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-6 shadow-tactile-card animate-pulse space-y-3',
              className
            )}
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-1/3 rounded-md bg-slate-200" />
              <div className="h-5 w-24 rounded-full bg-slate-100" />
            </div>
            <div className="h-4 w-1/4 rounded-md bg-slate-100" />
            <div className="h-3.5 w-full rounded-md bg-slate-100" />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={idx} className={cn('space-y-2.5 animate-pulse', className)}>
            <div className="h-4 w-3/4 rounded-md bg-slate-200" />
            <div className="h-4 w-full rounded-md bg-slate-100" />
            <div className="h-4 w-5/6 rounded-md bg-slate-100" />
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderItem(idx))}
    </>
  );
}