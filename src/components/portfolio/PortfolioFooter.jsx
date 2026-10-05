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
    { label: 'Overview', href: '/#about' },
    ...(hasProjects ? [{ label: 'Selected Works', href: '/projects' }] : []),
    ...(hasExperiences ? [{ label: 'Timeline & Notes', href: '/#experience' }] : []),
    ...(hasServices ? [{ label: 'Consulting Scope', href: '/#services' }] : []),
    ...(hasBlogs ? [{ label: 'Essays & Monographs', href: '/blogs' }] : []),
    { label: 'Direct Inquiries', href: '/#contact' },
  ];

  const socialLinks = about?.social_links || {};
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-[#E7E2DA] mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-[#E7E2DA]">
          {/* Column 1: Identity & Role */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#141416] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-sm tracking-wider">
                {about?.name ? about.name.split(' ').map((n) => n[0]).join('') : 'AM'}
              </div>
              <span className="font-serif font-semibold text-base text-[#141416] tracking-tight">
                {about?.name || 'Alex Mercer'}
              </span>
            </div>
            <p className="text-sm text-[#44403C] max-w-sm leading-relaxed font-sans">
              {about?.title || 'Principal Backend & Systems Architect'}.{' '}
              {about?.bio ||
                'Specializing in distributed systems, event-driven architectures, and high-concurrency microservices.'}
            </p>
            {/* Live Status Pill */}
            <div className="flex items-center gap-2 text-xs text-[#15803D] font-mono pt-1">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Available for select advisory & production contracts</span>
            </div>
          </div>

          {/* Column 2: Content-Aware Sitemap */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              // Index Directory
            </h3>
            <ul className="space-y-2 text-sm font-sans">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#44403C] hover:text-[#C2410C] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Connect & Socials */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              // Verified Channels
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
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#44403C] hover:text-[#C2410C] underline underline-offset-4"
                >
                  <span>Download Curriculum Vitae (PDF)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Colophon & Top Scroll */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <div className="flex items-center gap-2 font-mono">
            <Terminal className="h-3.5 w-3.5 text-[#78716C]" />
            <span>
              © {currentYear} {about?.name || 'Alex Mercer'}. Set in Newsreader & Geist.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="btn-press inline-flex items-center gap-1 text-[#44403C] hover:text-[#141416] transition-colors font-mono cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}