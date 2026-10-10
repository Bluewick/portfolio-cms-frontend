import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSectionVisibility } from '../../hooks/useSectionVisibility';
import { useAbout } from '../../hooks/usePortfolio';
import { cn } from '../../lib/utils';

export function PortfolioNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasProjects, hasBlogs, hasExperiences, hasServices } = useSectionVisibility();
  const { data: about } = useAbout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live real-time world clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Monitor scroll depth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor intersection on home page sections
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    const sectionIds = ['about', 'skills', 'projects', 'experience', 'services', 'writing', 'contact'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const navItems = [
    { label: 'Overview', target: 'about', route: '/' },
    ...(hasProjects ? [{ label: 'Selected Works', target: 'projects', route: '/projects' }] : []),
    ...(hasExperiences ? [{ label: 'Timeline', target: 'experience', route: '/' }] : []),
    ...(hasServices ? [{ label: 'Consulting', target: 'services', route: '/' }] : []),
    ...(hasBlogs ? [{ label: 'Essays', target: 'writing', route: '/blogs' }] : []),
  ];

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const el = document.getElementById(item.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (item.route === '/' && item.target) {
      navigate(`/#${item.target}`);
    } else {
      navigate(item.route);
    }
  };

  const isItemActive = (item) => {
    if (location.pathname === '/projects' && item.target === 'projects') return true;
    if (location.pathname.startsWith('/projects/') && item.target === 'projects') return true;
    if (location.pathname === '/blogs' && item.target === 'writing') return true;
    if (location.pathname.startsWith('/blogs/') && item.target === 'writing') return true;
    if (location.pathname === '/' && activeSection === item.target) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-4 md:gap-8',
            'h-13 px-4 md:px-5 rounded-full',
            'bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E7E2DA]',
            'shadow-[0_4px_20px_-4px_rgba(20,20,22,0.06)] transition-all duration-300',
            isScrolled ? 'border-[#D6CFC4] shadow-[0_8px_24px_-6px_rgba(20,20,22,0.1)] bg-[#FAF8F5]/95' : ''
          )}
        >
          {/* Brand Monogram & Live Status Dot */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
            aria-label="Portfolio Home"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-[#141416] text-[#FAF8F5] flex items-center justify-center font-serif text-sm font-semibold tracking-wider transition-transform duration-200 group-hover:scale-105 border border-[#141416]">
                {about?.name ? about.name.split(' ').map((n) => n[0]).join('') : 'V'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A] border-2 border-[#FAF8F5]" />
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-semibold text-sm tracking-tight text-[#141416]">
                {about?.name || 'Vivek'}
              </span>
              {currentTime && (
                <span className="text-[10px] font-mono text-[#78716C] leading-none">
                  {currentTime}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <a
                  key={item.label}
                  href={item.route === '/' ? `/#${item.target}` : item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    'relative py-1 text-[13px] font-medium transition-colors font-sans',
                    active
                      ? 'text-[#C2410C] font-semibold'
                      : 'text-[#44403C] hover:text-[#141416]'
                  )}
                >
                  {item.label}
                  {/* Micro-dot Active Indicator (Terracotta #C2410C) */}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#C2410C]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTA + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleNavClick(e, { target: 'contact', route: '/' })}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full',
                'bg-[#141416] text-[#FAF8F5] text-xs font-medium font-sans',
                'hover:bg-[#2A2928] btn-press shadow-xs cursor-pointer'
              )}
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full border border-[#E7E2DA] text-[#44403C] hover:bg-[#F4EFEA] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#141416]/30 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
          <div className="fixed top-20 inset-x-4 bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl p-6 shadow-[0_16px_36px_rgba(20,20,22,0.12)] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7E2DA]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                // Navigation Index
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#78716C] hover:text-[#141416] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.route === '/' ? `/#${item.target}` : item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                    isItemActive(item)
                      ? 'bg-[#F4EFEA] text-[#C2410C] font-semibold'
                      : 'text-[#44403C] hover:bg-[#F4EFEA] hover:text-[#141416]'
                  )}
                >
                  <span className="font-serif text-base">{item.label}</span>
                  {isItemActive(item) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C2410C]" />
                  )}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, { target: 'contact', route: '/' })}
                className="mt-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#141416] text-[#FAF8F5] text-center btn-press cursor-pointer"
              >
                Get in Touch
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}