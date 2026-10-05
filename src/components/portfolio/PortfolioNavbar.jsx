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

  // Monitor scroll depth for subtle shadow elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor intersection on home page sections for micro-dot indicator
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

  // Dynamically assemble navigation items based on Ghost Section rules
  const navItems = [
    { label: 'About', target: 'about', route: '/' },
    ...(hasProjects ? [{ label: 'Projects', target: 'projects', route: '/projects' }] : []),
    ...(hasExperiences ? [{ label: 'Experience', target: 'experience', route: '/' }] : []),
    ...(hasServices ? [{ label: 'Services', target: 'services', route: '/' }] : []),
    ...(hasBlogs ? [{ label: 'Writing', target: 'writing', route: '/blogs' }] : []),
  ];

  // Smart navigation: scroll to ID if on Home, else navigate to route with hash
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
      <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-4 md:gap-8',
            'h-12 md:h-13 px-3.5 md:px-5 rounded-full',
            'bg-white/95 backdrop-blur-md border border-slate-200',
            'shadow-pill-floating transition-all duration-200',
            isScrolled ? 'border-slate-300 shadow-tactile-hover' : ''
          )}
        >
          {/* Brand Monogram */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-hidden"
            aria-label="Alex Mercer Portfolio Home"
          >
            <div className="h-8 w-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs tracking-wider transition-transform duration-200 group-hover:scale-105">
              {about?.name ? about.name.split(' ').map((n) => n[0]).join('') : 'AM'}
            </div>
            <span className="font-semibold text-xs tracking-tight text-slate-900 hidden sm:inline-block">
              {about?.name || 'Alex Mercer'}
            </span>
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
                    'relative py-1 text-[13px] font-medium transition-colors',
                    active ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {item.label}
                  {/* Micro-dot Active Indicator (4px circular dot #0F172A) */}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#0f172a]" />
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
                'bg-[#0f172a] text-white text-xs font-semibold',
                'hover:bg-[#1e293b] active:scale-95 transition-all shadow-xs'
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
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
          <div className="fixed top-22 inset-x-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-tactile-hover space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.route === '/' ? `/#${item.target}` : item.route}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                    isItemActive(item)
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span>{item.label}</span>
                  {isItemActive(item) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" />
                  )}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, { target: 'contact', route: '/' })}
                className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#0f172a] text-white text-center"
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