import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, Terminal, Sparkles } from 'lucide-react';
import { useAbout } from '../../../hooks/usePortfolio';
import { LiveStatusBadge } from '../common/LiveStatusBadge';
import { SocialIconLink } from '../common/SocialIconLink';
import { TerminalCard } from '../common/TerminalCard';
import { SkeletonLoader } from '../common/SkeletonLoader';

function ArchitectureFootnote({ term, note }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dotted border-[#78716C] text-[#141416] font-medium hover:text-[#C2410C] hover:border-[#C2410C] transition-colors">
        {term}
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-[#E7E2DA] rounded-xl shadow-[0_12px_30px_rgba(20,20,22,0.1)] text-xs text-[#44403C] z-30 font-sans normal-case pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <span className="block font-mono text-[10px] text-[#C2410C] uppercase tracking-wider mb-1 font-semibold">
            // ARCHITECTURE SPEC
          </span>
          {note}
        </span>
      )}
    </span>
  );
}

export function HeroSection() {
  const { data: about, isLoading } = useAbout();

  if (isLoading) {
    return (
      <section className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <SkeletonLoader variant="text" count={3} />
      </section>
    );
  }

  const socialLinks = about?.social_links || {};

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Pitch & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overline & Live Status */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
              // {about?.title ? about.title.toUpperCase() : 'PRINCIPAL SYSTEMS ARCHITECT'}
            </span>
            <LiveStatusBadge text="Available for Q4 contracts & advisory" />
          </div>

          {/* Display Editorial Serif Headline with Italic Flourish */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-normal tracking-[-0.025em] text-[#141416] leading-[1.1]">
            Architecting <em className="italic font-serif text-[#C2410C]">resilient</em>, high-throughput systems with rigorous{' '}
            <em className="italic font-serif">editorial craft</em>.
          </h1>

          {/* Subhead Prose with Architecture Footnotes */}
          <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-2xl font-normal">
            I’m <strong className="text-[#141416] font-semibold">{about?.name || 'Alex Mercer'}</strong>, specialized in mission-critical{' '}
            <ArchitectureFootnote
              term="PostgreSQL transactions"
              note="Strict ACID boundaries, zero dirty reads, P99 query profiling & connection pool tuning."
            />
            , scalable{' '}
            <ArchitectureFootnote
              term="event-driven pipelines"
              note="Idempotent consumer groups, Kafka partitioning, and guaranteed at-least-once delivery."
            />
            , and{' '}
            <ArchitectureFootnote
              term="distributed lock systems"
              note="Redlock consensus, lease timeouts, and fencing tokens to prevent race mutations."
            />
            .{' '}
            {about?.bio ||
              'Focused on mission-critical database performance, scalable event-driven architectures, and high-concurrency microservices.'}
          </p>

          {/* Action Cluster with Tactile Spring Feedback */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToProjects}
              className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold shadow-xs hover:bg-[#2A2928] cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={scrollToContact}
              className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#141416] border border-[#E7E2DA] text-xs font-semibold hover:border-[#D6CFC4] hover:bg-[#FAF8F5] cursor-pointer shadow-xs"
            >
              <span>Initiate Inquiry</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            {about?.resume_url && (
              <a
                href={about.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 px-4 py-3 rounded-full text-[#44403C] hover:text-[#141416] text-xs font-medium transition-colors"
                title="Download Curriculum Vitae"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Curriculum Vitae</span>
              </a>
            )}
          </div>

          {/* Verified Profiles Row */}
          <div className="pt-3 flex items-center gap-3 border-t border-[#E7E2DA]">
            <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">
              // Verified Channels:
            </span>
            <div className="flex items-center gap-2">
              {socialLinks.github && (
                <SocialIconLink type="github" url={socialLinks.github} label="GitHub" />
              )}
              {socialLinks.linkedin && (
                <SocialIconLink type="linkedin" url={socialLinks.linkedin} label="LinkedIn" />
              )}
              {socialLinks.twitter && (
                <SocialIconLink type="twitter" url={socialLinks.twitter} label="Twitter / X" />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Workstation Telemetry Inspector */}
        <div className="lg:col-span-5">
          <TerminalCard
            title="workstation ~ alex@mercer-monograph"
            lines={[
              { type: 'command', text: 'whoami' },
              { type: 'output', text: `${about?.name || 'Alex Mercer'} — ${about?.title || 'Principal Systems Architect'}` },
              { type: 'command', text: 'cat /etc/core-stack.conf' },
              { type: 'output', text: 'PRIMARY_STORAGE: PostgreSQL 16 + Redis Cluster' },
              { type: 'output', text: 'MESSAGING: Apache Kafka & RabbitMQ' },
              { type: 'output', text: 'RUNTIMES: Node.js 22 LTS, Go 1.22, Docker' },
              { type: 'command', text: 'echo $STATUS' },
              { type: 'output', text: 'STATUS: Open for select advisory & contracts' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}