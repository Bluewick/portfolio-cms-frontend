import React from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function TerminalCard({
  title = 'bash ~ npx alexmercer --system-status',
  lines = [
    { type: 'command', text: 'npx system-check' },
    { type: 'output', text: '✔ Core Engine: Node.js 22 LTS / PostgreSQL 16 Active' },
    { type: 'output', text: '✔ Architecture: High-concurrency event-driven microservices' },
    { type: 'output', text: '✔ Availability: Ready for contracts & principal roles' },
  ],
  className,
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-tactile-card',
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* macOS 10px dots */}
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-code">
          <Terminal className="h-3 w-3 text-slate-400" />
          <span>{title}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Terminal Body */}
      <div className="p-5 font-code text-xs md:text-[13px] leading-relaxed space-y-2 text-slate-200">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {line.type === 'command' ? (
              <>
                <span className="text-emerald-400 select-none font-bold">$</span>
                <span className="text-slate-100 font-medium">{line.text}</span>
              </>
            ) : (
              <span className="text-slate-400 pl-4">{line.text}</span>
            )}
          </div>
        ))}
        {/* Blinking Prompt Cursor */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 select-none font-bold">$</span>
          <span className="inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}