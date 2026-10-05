import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Terminal } from 'lucide-react';
import { useSectionVisibility } from '../../hooks/useSectionVisibility';
import { useAbout } from '../../hooks/usePortfolio';
import { SocialIconLink } from './common/SocialIconLink';

export function PortfolioFooter() {
  const { data: about } = useAbout();
  const { hasProjects, hasBlogs, hasExperiences, hasServices } = useSectionVisibility();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { label: 'About', href: '/#about' },
    ...(hasProjects ? [{ label: 'Projects', href: '/projects' }] : []),
    ...(hasExperiences ? [{ label: 'Experience', href: '/#experience' }] : []),
    ...(hasServices ? [{ label: 'Services', href: '/#services' }] : []),
    ...(hasBlogs ? [{ label: 'Writing', href: '/blogs' }] : []),
    { label: 'Contact', href: '/#contact' },
  ];

  const socialLinks = about?.social_links || {};
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-slate-100">
          {/* Column 1: Identity & Role */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-wider">
                {about?.name ? about.name.split(' ').map((n) => n[0]).join('') : 'AM'}
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">
                {about?.name || 'Alex Mercer'}
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              {about?.title || 'Principal Systems & Backend Architect'}.{' '}
              {about?.bio ||
                'Specializing in distributed systems, event-driven architectures, and high-concurrency microservices.'}
            </p>
            {/* Live Status Pill */}
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium pt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for select engineering contracts & advisory</span>
            </div>
          </div>

          {/* Column 2: Content-Aware Sitemap */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Connect & Socials */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
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
            {about?.resume_url && (
              <div className="pt-2">
                <a
                  href={about.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4"
                >
                  <span>Download Curriculum Vitae (PDF)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Specs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-code">
              © {currentYear} {about?.name || 'Alex Mercer'}. Tactile Structural Engineering.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}