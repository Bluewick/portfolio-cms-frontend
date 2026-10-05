import React from 'react';
import { Database, ShieldCheck, Zap, Activity } from 'lucide-react';
import { TactileCard } from '../common/TactileCard';

export function BentoGridSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Card Variant A: Focal Highlight Card (Dark #0F172A) */}
        <div className="md:col-span-2 rounded-3xl bg-[#0f172a] text-white p-7 md:p-8 flex flex-col justify-between shadow-tactile-card border border-slate-800">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Production Philosophy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              Building software that stays stable under severe concurrency loads.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Systems fail at the seams—where transactions deadlock and state drifts. I design
              fault-tolerant backends with idempotent APIs, read-replicas, and ACID integrity.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-code">
            <span>DATABASE INTEGRITY FIRST</span>
            <span className="text-emerald-400 font-semibold">100% ACID</span>
          </div>
        </div>

        {/* Card Variant B: Metric Stat Card 1 */}
        <TactileCard className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">
              &lt; 35ms
            </div>
            <h3 className="text-sm font-semibold text-slate-900">P99 Query Latency</h3>
          </div>
          <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
            Achieved through index profiling, connection pooling, and multi-tier Redis caching.
          </p>
        </TactileCard>

        {/* Card Variant B: Metric Stat Card 2 */}
        <TactileCard className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">
              99.99%
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Uptime Reliability</h3>
          </div>
          <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
            Automated health checks, zero-downtime rolling deploys, and graceful error handling.
          </p>
        </TactileCard>
      </div>
    </section>
  );
}