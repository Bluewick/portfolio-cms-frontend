import React from 'react';
import { Database, ShieldCheck, Zap, Activity } from 'lucide-react';
import { TactileCard } from '../common/TactileCard';

export function BentoGridSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Card Variant A: Focal Monograph Highlight Card (Carbon Paper with Warm Linen Accents) */}
        <div className="md:col-span-2 rounded-2xl md:rounded-3xl bg-[#141416] text-[#FAF8F5] p-7 md:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(20,20,22,0.08)] border border-[#2A2928]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[#2A2928] border border-[#3A3836] text-[11px] font-mono text-[#D6CFC4]">
              <Activity className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>// ENGINEERING MANIFESTO</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-[#FAF8F5] leading-snug">
              Building software that stays stable under <em className="italic font-serif text-[#FED7AA]">severe concurrency</em> loads.
            </h2>
            <p className="text-sm text-[#A8A29E] leading-relaxed font-normal font-sans">
              Systems degrade at the seams—where transactions deadlock and state drifts. I design
              fault-tolerant backends with idempotent APIs, read-replicas, and strict ACID integrity.
            </p>
          </div>

          <div className="pt-6 border-t border-[#2A2928] flex items-center justify-between text-xs text-[#A8A29E] font-mono">
            <span>DATABASE INTEGRITY FIRST</span>
            <span className="text-[#86EFAC] font-semibold">100% ACID CONSISTENCY</span>
          </div>
        </div>

        {/* Card Variant B: Metric Stat Card 1 */}
        <TactileCard className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-[#F4EFEA] border border-[#E7E2DA] flex items-center justify-center text-[#C2410C]">
              <Zap className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div className="font-serif text-3xl md:text-4xl font-normal text-[#141416] tracking-tight">
              &lt; 35ms
            </div>
            <h3 className="text-sm font-semibold text-[#141416] font-sans">P99 Query Latency</h3>
          </div>
          <p className="text-xs text-[#78716C] pt-3 border-t border-[#E7E2DA] font-sans">
            Achieved through index profiling, connection pooling, and multi-tier Redis caching.
          </p>
        </TactileCard>

        {/* Card Variant B: Metric Stat Card 2 */}
        <TactileCard className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-[#F4EFEA] border border-[#E7E2DA] flex items-center justify-center text-[#15803D]">
              <ShieldCheck className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div className="font-serif text-3xl md:text-4xl font-normal text-[#141416] tracking-tight">
              99.99%
            </div>
            <h3 className="text-sm font-semibold text-[#141416] font-sans">Uptime Reliability</h3>
          </div>
          <p className="text-xs text-[#78716C] pt-3 border-t border-[#E7E2DA] font-sans">
            Automated health checks, zero-downtime rolling deploys, and graceful error handling.
          </p>
        </TactileCard>
      </div>
    </section>
  );
}