import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Cpu,
  Briefcase,
  Layers,
  MessageSquareQuote,
  UserCheck,
  Inbox,
  ShieldCheck,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { UserDropdown } from './UserDropdown';

const navigationGroups = [
  {
    title: 'MAIN NAVIGATION',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PORTFOLIO CONTENT',
    items: [
      { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
      { name: 'Blog Posts', path: '/admin/blogs', icon: BookOpen },
      { name: 'Skills & Stack', path: '/admin/skills', icon: Cpu },
      { name: 'Experiences', path: '/admin/experiences', icon: Briefcase },
      { name: 'Services', path: '/admin/services', icon: Layers },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    title: 'SYSTEM & INBOX',
    items: [
      { name: 'About / Profile', path: '/admin/about', icon: UserCheck },
      { name: 'Contact Inbox', path: '/admin/contact', icon: Inbox, hasBadge: true },
    ],
  },
];

export function Sidebar({ isMobileOpen, onCloseMobile }) {
  // Query unread inbox count to display dynamically on the Contact link
  const { data: contactData } = useQuery({
    queryKey: ['contacts', 'admin', 'unread-count'],
    queryFn: async () => {
      const res = await api.get('/api/admin/contact?page=1&limit=50');
      return res.data;
    },
    refetchInterval: 30000, // Poll every 30s
  });

  const unreadCount = contactData?.data?.filter((msg) => !msg.is_read)?.length || 0;

  const content = (
    <div className="flex flex-col h-full bg-[#f8fafc] border-r border-[#e2e8f0]">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#e2e8f0] bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#0f172a] tracking-tight block">
              PORTFOLIO CMS
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold block">
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden text-[#94a3b8] hover:text-[#0f172a] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-2 text-[11px] font-semibold text-[#94a3b8] tracking-[0.04em] uppercase">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between h-9 px-3 rounded-lg text-xs font-medium transition-colors select-none ${
                        isActive
                          ? 'bg-[#eff6ff] text-[#2563eb] font-semibold'
                          : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>

                    {item.hasBadge && unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2563eb] text-white">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Card Anchor */}
      <div className="p-4 border-t border-[#e2e8f0] bg-white shrink-0">
        <UserDropdown />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-level-3 z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}