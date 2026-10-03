import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Search, ExternalLink } from 'lucide-react';

const routeTitleMap = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/projects': 'Projects Management',
  '/admin/projects/new': 'New Project',
  '/admin/blogs': 'Blog Engine',
  '/admin/blogs/new': 'Write Blog Article',
  '/admin/skills': 'Skills & Technology Stack',
  '/admin/experiences': 'Career Timeline',
  '/admin/services': 'Service Offerings',
  '/admin/testimonials': 'Client Testimonials',
  '/admin/about': 'Profile & Bio Settings',
  '/admin/contact': 'Contact Messages Inbox',
};

export function Topbar({ onOpenMobileMenu }) {
  const location = useLocation();
  const currentTitle = routeTitleMap[location.pathname] || 'Admin Workspace';

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Area: Mobile Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden text-[#475569] hover:text-[#0f172a] p-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#94a3b8] font-medium hidden sm:inline">CMS</span>
          <span className="text-[#cbd5e1] hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold text-[#0f172a]">{currentTitle}</h1>
        </div>
      </div>

      {/* Right Area: Search & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Command Search Bar Input Mockup */}
        <div className="hidden sm:flex items-center h-9 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs text-[#94a3b8] gap-2 w-52 md:w-64 focus-within:border-[#2563eb] focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent border-none outline-none w-full text-xs text-[#0f172a] placeholder:text-[#94a3b8]"
          />
          <span className="px-1.5 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] text-[#64748b] rounded text-[10px] font-semibold tracking-wider">
            ⌘K
          </span>
        </div>

        {/* View Live Portfolio External Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-[#475569] bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors shadow-level-1"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#2563eb]" />
          <span className="hidden sm:inline">Live Site</span>
        </a>
      </div>
    </header>
  );
}