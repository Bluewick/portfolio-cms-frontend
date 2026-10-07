import React, { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

export function TableOfContents({ headings = [], variant = 'all' }) {
  const [activeId, setActiveId] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!headings.length) return;

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -65% 0%', threshold: 0 }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      setIsMobileOpen(false);
    }
  };

  const showMobile = variant === 'all' || variant === 'mobile';
  const showDesktop = variant === 'all' || variant === 'desktop';

  return (
    <>
      {/* 1. Mobile Collapsible Dropdown Pill */}
      {showMobile && (
        <div className="xl:hidden my-6 rounded-xl border border-[#E7E2DA] bg-[#FAF8F5] p-3 shadow-xs">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex w-full items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-[#141416]"
          >
            <span className="flex items-center gap-2">
              <List className="h-4 w-4 text-[#C2410C]" />
              <span>Table of Contents ({headings.length})</span>
            </span>
            <ChevronRight
              className={`h-4 w-4 text-[#78716C] transition-transform ${
                isMobileOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {isMobileOpen && (
            <nav className="mt-3 space-y-1.5 border-t border-[#E7E2DA] pt-3 text-xs">
              {headings.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollTo(item.id)}
                  className={`block w-full text-left font-serif transition-colors ${
                    item.level === 3 ? 'pl-4 text-[13px]' : 'text-sm font-medium'
                  } ${
                    activeId === item.id
                      ? 'font-bold text-[#C2410C]'
                      : 'text-[#44403C] hover:text-[#141416]'
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* 2. Desktop Sticky Rail */}
      {showDesktop && (
        <aside className="hidden xl:block sticky top-28 self-start w-full space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E7E2DA] text-xs font-mono font-bold uppercase tracking-wider text-[#141416]">
            <List className="h-3.5 w-3.5 text-[#C2410C]" />
            <span>Outline</span>
          </div>

          <nav className="space-y-2 text-xs max-h-[calc(100vh-180px)] overflow-y-auto pr-2 scrollbar-thin">
            {headings.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollTo(item.id)}
                  className={`group block w-full text-left transition-all leading-snug ${
                    item.level === 3 ? 'pl-3 text-[12px]' : 'text-[13px]'
                  } ${
                    isActive
                      ? 'font-semibold text-[#C2410C] border-l-2 border-[#C2410C] pl-2 -ml-2'
                      : 'text-[#78716C] hover:text-[#141416]'
                  }`}
                >
                  <span className="font-serif line-clamp-2">{item.text}</span>
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}