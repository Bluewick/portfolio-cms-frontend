import React from 'react';
import { ArrowDown, ArrowUpRight, Download, FileText } from 'lucide-react';
import { useAbout } from '../../../hooks/usePortfolio';
import { LiveStatusBadge } from '../common/LiveStatusBadge';
import { SocialIconLink } from '../common/SocialIconLink';
import { TerminalCard } from '../common/TerminalCard';
import { SkeletonLoader } from '../common/SkeletonLoader';

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
          {/* Live Availability Pill */}
          <div>
            <LiveStatusBadge text="Available for software roles & consulting" />
          </div>

          {/* Display 2XL Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#0f172a] leading-[1.1]">
            Architecting{' '}
            <span className="underline decoration-slate-300 underline-offset-8">resilient</span>,{' '}
            high-throughput distributed systems.
          </h1>

          {/* Subhead Lead */}
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
            I’m <strong className="text-slate-900 font-semibold">{about?.name || 'Alex Mercer'}</strong>, a{' '}
            <span className="text-slate-900 font-medium">{about?.title || 'Principal Backend & Systems Architect'}</span>.{' '}
            {about?.bio ||
              'Focused on mission-critical database performance, scalable event-driven architectures, and high-concurrency microservices.'}
          </p>

          {/* CTA Action Button Group */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] text-white text-sm font-semibold shadow-xs hover:bg-[#1e293b] active:scale-95 transition-all"
            >
              <span>Initiate Collaboration</span>
              <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0f172a] border border-slate-200 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-xs"
            >
              <span>Explore Projects</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            {about?.resume_url && (
              <a
                href={about.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                title="Download Resume"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
              </a>
            )}
          </div>

          {/* Social Links Row */}
          <div className="pt-4 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Profiles:
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

        {/* Right Column: Tactical Terminal Card */}
        <div className="lg:col-span-5">
          <TerminalCard
            title="workstation ~ alex@mercer-core"
            lines={[
              { type: 'command', text: 'whoami' },
              { type: 'output', text: `${about?.name || 'Alex Mercer'} — ${about?.title || 'Systems Architect'}` },
              { type: 'command', text: 'cat /etc/core-stack.conf' },
              { type: 'output', text: 'PRIMARY_STORAGE: PostgreSQL 16 + Redis Cluster' },
              { type: 'output', text: 'MESSAGING: Apache Kafka & RabbitMQ' },
              { type: 'output', text: 'RUNTIMES: Node.js 22 LTS, Go, Docker' },
              { type: 'command', text: 'echo $STATUS' },
              { type: 'output', text: 'READY: Open to advisory & production consulting' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}