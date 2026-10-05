import React from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function TerminalCard({
  title = 'inspector ~ runtime-telemetry',
  lines = [
    { type: 'command', text: 'whoami' },
    { type: 'output', text: 'Alex Mercer — Principal Systems Architect' },
    { type: 'command', text: 'cat /etc/core-telemetry.conf' },
    { type: 'output', text: 'ENGINE: Node.js 22 LTS + Go 1.22' },
    { type: 'output', text: 'STORAGE: PostgreSQL 16 (P99 < 35ms) + Redis 7' },
    { type: 'output', text: 'EVENT_BUS: Apache Kafka (0 state drift)' },
    { type: 'command', text: 'echo $STATUS' },
    { type: 'output', text: 'READY: Open for select technical advisory & contracts' },
  ],
  className,
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E2DA] bg-white shadow-[0_4px_24px_-4px_rgba(20,20,22,0.06)]',
        className
      )}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[#E7E2DA] bg-[#F4EFEA] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E7E2DA] border border-[#D6CFC4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E7E2DA] border border-[#D6CFC4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E7E2DA] border border-[#D6CFC4]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-mono">
          <Terminal className="h-3 w-3 text-[#78716C]" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#16A34A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="hidden sm:inline">LIVE</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 font-mono text-xs md:text-[13px] leading-relaxed space-y-2 bg-[#FAF8F5] text-[#141416]">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {line.type === 'command' ? (
              <>
                <span className="text-[#C2410C] select-none font-bold">$</span>
                <span className="text-[#141416] font-medium">{line.text}</span>
              </>
            ) : (
              <span className="text-[#44403C] pl-4">{line.text}</span>
            )}
          </div>
        ))}
        {/* Blinking Prompt Cursor */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[#C2410C] select-none font-bold">$</span>
          <span className="inline-block h-4 w-2 bg-[#C2410C] animate-pulse" />
        </div>
      </div>
    </div>
  );
}