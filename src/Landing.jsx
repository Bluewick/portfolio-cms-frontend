import React, { useState } from 'react';

// --- Inline Minimal SVG Icons ---
const Icons = {
  Github: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  Twitter: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  ),
  Code: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Layers: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export default function Landing() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const sampleSnippet = `// Strict Type-Safe RPC Node Handler
export async function streamMetrics(clusterId: string) {
  const node = await clusterRegistry.resolve(clusterId);
  return node.telemetry.pipeThrough(new CompressionStream('gzip'));
}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(sampleSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] font-sans antialiased selection:bg-[#ede9fe] selection:text-[#7c3aed]">
      {/* ========================================================================= */}
      {/* 1. FLOATING PILL NAVIGATION                                              */}
      {/* ========================================================================= */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto h-12 sm:h-13 bg-white/95 backdrop-blur-md rounded-full border border-black/[0.06] shadow-[0_12px_24px_-4px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.02)] px-3 sm:px-4 py-1.5 flex items-center gap-1 sm:gap-2">
          {/* Logo / Initials */}
          <a
            href="#hero"
            className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-tight transition-transform hover:scale-105"
          >
            AR
          </a>

          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Links */}
          <div className="flex items-center gap-1 text-[13px] font-medium text-[#475569]">
            <a href="#work" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#0f172a] hover:bg-[#f8f9fa] transition-colors">
              Work
            </a>
            <a href="#services" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#0f172a] hover:bg-[#f8f9fa] transition-colors">
              Capabilities
            </a>
            <a href="#experience" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#0f172a] hover:bg-[#f8f9fa] transition-colors hidden md:inline-block">
              Experience
            </a>
            <a href="#code" className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#0f172a] hover:bg-[#f8f9fa] transition-colors hidden lg:inline-block">
              Architecture
            </a>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 mx-1" />

          {/* Socials & Primary CTA */}
          <div className="flex items-center gap-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#475569] hover:text-[#0f172a] hover:bg-[#f8f9fa] transition-colors"
            >
              <Icons.Github />
            </a>
            <a
              href="#contact"
              className="ml-1 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold tracking-tight transition-all active:scale-95 shadow-sm"
            >
              Book a Call
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content Wrap */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-24 space-y-24 sm:space-y-32">
        {/* ========================================================================= */}
        {/* 2. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section id="hero" className="flex flex-col items-start gap-8 pt-4">
          {/* Avatar & Live Status Pill */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80"
                alt="Alex Rivera"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-black/[0.08] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)]"
              />
            </div>

            {/* Live Status Accent Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[13px] font-medium text-[#15803d]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
              </span>
              Available for Q2/Q3 projects
            </div>
          </div>

          {/* Bold Display Headline & Lead */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-[#0f172a] tracking-[-0.035em] leading-[1.08]">
              Senior Software Engineer & Product Architect.
            </h1>
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed max-w-2xl font-normal">
              I build resilient cloud backends, low-latency microservices, and fluid, tactile web applications designed to scale cleanly.
            </p>
          </div>

          {/* Action Group */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold tracking-tight transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
            >
              Get in Touch
            </a>
            <a
              href="#work"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#f1f3f5] text-[#0f172a] border border-black/[0.06] text-sm font-semibold tracking-tight transition-all duration-200 shadow-sm"
            >
              Explore Projects
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. METRICS / STATS BENTO GRID                                            */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: '8+', label: 'Years production craft' },
            { metric: '99.99%', label: 'Uptime SLA maintained' },
            { metric: '140k+', label: 'Monthly active requests' },
            { metric: '<18ms', label: 'p99 global latency' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] transition-all hover:translate-y-[-2px]"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
                {item.metric}
              </div>
              <p className="mt-1 text-xs sm:text-[13px] text-[#94a3b8] font-normal leading-normal">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* 4. SELECTED WORK & DEVICE MOCKUPS                                        */}
        {/* ========================================================================= */}
        <section id="work" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#94a3b8]">
                Featured Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#0f172a] mt-1">
                Engineered with precision.
              </h2>
            </div>
            <p className="text-sm text-[#475569] max-w-sm">
              Production distributed services and interface systems built for real customer throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Card 1 */}
            <article className="group bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Browser / Device Mockup Frame */}
                <div className="rounded-2xl border border-black/[0.06] bg-[#f8f9fa] p-3 shadow-inner mb-6 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="mx-auto px-4 py-0.5 rounded-full bg-white text-[11px] text-[#64748b] border border-black/[0.04]">
                      mesh-analytics.internal
                    </div>
                  </div>
                  {/* Internal Mockup Content */}
                  <div className="bg-white rounded-xl p-4 border border-black/[0.04] space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-[#0f172a]">Ingestion Stream</span>
                      <span className="text-[11px] font-medium text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                        Healthy
                      </span>
                    </div>
                    <div className="h-16 flex items-end gap-1.5 pt-2">
                      {[40, 65, 35, 80, 50, 95, 70, 85, 60, 90, 75, 100].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-[#e0f2fe] rounded-t-sm group-hover:bg-[#0284c7] transition-colors duration-300"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pastel Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[13px] font-medium bg-[#e0f2fe] text-[#0284c7]">
                    Distributed Systems
                  </span>
                  <span className="px-3 py-1 rounded-full text-[13px] font-medium bg-[#ede9fe] text-[#7c3aed]">
                    Go & Rust
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-[#0f172a] tracking-tight mb-2">
                  MeshPulse Telemetry Engine
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                  High-throughput event streaming backend capable of processing over 120,000 JSON payloads per second with sub-5ms serialization.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-[#94a3b8]">Live Case Study</span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f172a] hover:underline"
                >
                  View Architecture <Icons.ArrowUpRight />
                </a>
              </div>
            </article>

            {/* Project Card 2 */}
            <article className="group bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Browser / Device Mockup Frame */}
                <div className="rounded-2xl border border-black/[0.06] bg-[#f8f9fa] p-3 shadow-inner mb-6 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></div>
                    <div className="mx-auto px-4 py-0.5 rounded-full bg-white text-[11px] text-[#64748b] border border-black/[0.04]">
                      canvas.flowscript.dev
                    </div>
                  </div>
                  {/* Internal Mockup Content */}
                  <div className="bg-white rounded-xl p-4 border border-black/[0.04] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0f172a]">Component Tree</span>
                      <span className="text-[11px] font-medium text-[#d97706] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                        60 FPS
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="h-10 bg-[#f1f5f9] rounded-lg border border-slate-200/60" />
                      <div className="h-10 bg-[#ede9fe]/40 rounded-lg border border-[#ede9fe]" />
                      <div className="h-10 bg-[#f1f5f9] rounded-lg border border-slate-200/60" />
                    </div>
                  </div>
                </div>

                {/* Pastel Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[13px] font-medium bg-[#fef3c7] text-[#d97706]">
                    Design Systems
                  </span>
                  <span className="px-3 py-1 rounded-full text-[13px] font-medium bg-[#ffe4e6] text-[#e11d48]">
                    Web Canvas
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-[#0f172a] tracking-tight mb-2">
                  Tactile Node Canvas & Studio
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                  A high-performance visual orchestration editor leveraging WebGL, zero-cost state updates, and accessible keyboard navigation.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-[#94a3b8]">Open Source</span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f172a] hover:underline"
                >
                  Explore Demo <Icons.ArrowUpRight />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SERVICES & CAPABILITIES GRID                                          */}
        {/* ========================================================================= */}
        <section id="services" className="space-y-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#94a3b8]">
              Core Competencies
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#0f172a] mt-1">
              Engineering with holistic ownership.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Icons.Cpu />,
                title: 'Backend & Systems',
                desc: 'Fault-tolerant distributed architectures, gRPC streaming, database optimization (PostgreSQL/Redis), and container orchestration.',
                pill: { text: 'Scalability', bg: 'bg-[#dcfce7]', fg: 'text-[#16a34a]' },
              },
              {
                icon: <Icons.Layers />,
                title: 'Tactile Interfaces',
                desc: 'Clean modernist frontends built with React, Next.js, and Tailwind. High-precision accessibility, animations, and micro-interactions.',
                pill: { text: 'Experience', bg: 'bg-[#e0f2fe]', fg: 'text-[#0284c7]' },
              },
              {
                icon: <Icons.Code />,
                title: 'Developer Experience',
                desc: 'Custom CLI tools, lint rules, CI/CD pipeline automation, and monorepo structure to compound engineering velocity.',
                pill: { text: 'Productivity', bg: 'bg-[#ede9fe]', fg: 'text-[#7c3aed]' },
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] border border-black/[0.04] text-[#0f172a] flex items-center justify-center">
                      {srv.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${srv.pill.bg} ${srv.pill.fg}`}>
                      {srv.pill.text}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f172a] tracking-tight mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed font-normal">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. STRICT MONOSPACE CODE SHOWCASE (Design Rule #3 Demonstration)         */}
        {/* ========================================================================= */}
        <section id="code" className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Code Quality & Standards
              </span>
              <h3 className="text-xl font-semibold text-[#0f172a] tracking-tight mt-0.5">
                Strict type safety by default
              </h3>
            </div>
            <button
              onClick={handleCopyCode}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] text-xs font-medium text-[#475569] border border-black/[0.06] transition-colors"
            >
              {copiedCode ? <Icons.Check /> : null}
              {copiedCode ? 'Copied to clipboard' : 'Copy snippet'}
            </button>
          </div>

          {/* Code block strictly using monospace */}
          <div className="mt-6 rounded-2xl bg-[#0f172a] text-slate-100 p-5 overflow-x-auto shadow-inner border border-slate-800">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed tracking-normal">
              <code>
                <span className="text-[#94a3b8]">// Strict Type-Safe RPC Node Handler</span>{'\n'}
                <span className="text-[#38bdf8]">export async function</span> <span className="text-[#a78bfa]">streamMetrics</span>(clusterId: <span className="text-[#facc15]">string</span>) {'{'}{'\n'}
                {'  '}<span className="text-[#38bdf8]">const</span> node = <span className="text-[#38bdf8]">await</span> clusterRegistry.<span className="text-[#60a5fa]">resolve</span>(clusterId);{'\n'}
                {'  '}<span className="text-[#38bdf8]">return</span> node.telemetry.<span className="text-[#60a5fa]">pipeThrough</span>(<span className="text-[#38bdf8]">new</span> <span className="text-[#4ade80]">CompressionStream</span>(<span className="text-[#f472b6]">'gzip'</span>));{'\n'}
                {'}'}
              </code>
            </pre>
          </div>
          <p className="mt-4 text-xs text-[#94a3b8] font-normal">
            * Monospace font (<span className="font-mono text-[#0f172a]">JetBrains Mono</span>) applied strictly inside syntax highlighted code blocks.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 7. CAREER TIMELINE                                                       */}
        {/* ========================================================================= */}
        <section id="experience" className="space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#94a3b8]">
              Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#0f172a] mt-1">
              Where I have delivered value.
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] divide-y divide-slate-100">
            {[
              {
                period: '2023 — Present',
                role: 'Staff Systems Architect',
                company: 'HyperScale Cloud',
                tag: 'Platform & Infra',
                tagColor: 'bg-[#e0f2fe] text-[#0284c7]',
              },
              {
                period: '2021 — 2023',
                role: 'Senior Fullstack Engineer',
                company: 'Veloce Data Systems',
                tag: 'Distributed Edge',
                tagColor: 'bg-[#ede9fe] text-[#7c3aed]',
              },
              {
                period: '2019 — 2021',
                role: 'Software Engineer',
                company: 'Starlight Studio',
                tag: 'Design Systems',
                tagColor: 'bg-[#f1f5f9] text-[#475569]',
              },
            ].map((exp, idx) => (
              <div
                key={idx}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="text-xs font-medium text-[#94a3b8] w-32 shrink-0">
                    {exp.period}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#0f172a]">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-[#475569]">{exp.company}</p>
                  </div>
                </div>
                <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-medium ${exp.tagColor}`}>
                  {exp.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CONTACT / BOOKING SECTION                                             */}
        {/* ========================================================================= */}
        <section id="contact" className="bg-white rounded-3xl p-7 sm:p-10 border border-black/[0.06] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#16a34a] mb-3">
              Let's Connect
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] leading-tight">
              Let's build something remarkable together.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#475569] leading-relaxed">
              Have an architecture initiative, contract role, or technical advisory in mind? Drop a message below or email directly at <strong className="text-[#0f172a] font-medium">alex@rivera.dev</strong>.
            </p>

            {formSubmitted ? (
              <div className="mt-6 p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#15803d] font-medium">
                Thank you! Your note has been received. I'll get back to you within 24 hours.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="mt-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full h-12 px-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:border-[#0f172a] focus:bg-white text-sm text-[#0f172a] outline-none transition-all placeholder:text-[#94a3b8]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full h-12 px-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:border-[#0f172a] focus:bg-white text-sm text-[#0f172a] outline-none transition-all placeholder:text-[#94a3b8]"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me a bit about your project and timeline..."
                  className="w-full p-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:border-[#0f172a] focus:bg-white text-sm text-[#0f172a] outline-none transition-all placeholder:text-[#94a3b8] resize-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold tracking-tight transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-black/[0.06] bg-white py-10 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <p>© {new Date().getFullYear()} Alex Rivera. Crafted with tactile clean modernism.</p>
          <div className="flex items-center gap-4 text-[#475569]">
            <a href="#hero" className="hover:text-[#0f172a] transition-colors">Back to top ↑</a>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#0f172a] transition-colors">GitHub</a>
            <span>•</span>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#0f172a] transition-colors">X / Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}