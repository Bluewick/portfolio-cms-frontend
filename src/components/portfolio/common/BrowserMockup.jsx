import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function BrowserMockup({
  url = 'https://portfolio.example.com',
  imageUrl,
  alt = 'Project preview',
  children,
  aspectRatio = 'aspect-[16/10]',
  className,
}) {
  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E2DA] bg-white shadow-[0_4px_20px_-4px_rgba(20,20,22,0.05)] transition-all duration-300 hover:border-[#D6CFC4]',
        className
      )}
    >
      {/* Top Browser Header */}
      <div className="flex items-center justify-between border-b border-[#E7E2DA] bg-[#FAF8F5] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E7E2DA]" />
          <span className="h-2 w-2 rounded-full bg-[#E7E2DA]" />
          <span className="h-2 w-2 rounded-full bg-[#E7E2DA]" />
        </div>

        {/* URL Bar Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#E7E2DA] bg-white px-3 py-0.5 text-[11px] text-[#78716C] shadow-2xs max-w-xs md:max-w-sm truncate font-mono">
          <Lock className="h-2.5 w-2.5 text-[#A8A29E] shrink-0" />
          <span className="truncate">{url}</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Viewport Content */}
      <div className={cn('relative w-full overflow-hidden bg-slate-100', aspectRatio)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" fill="%23f1f5f9"><rect width="800" height="500"/><text x="50%" y="50%" fill="%2394a3b8" font-size="16" text-anchor="middle" font-family="sans-serif">Project Preview Unavailable</text></svg>';
            }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}