import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortfolioNavbar } from './PortfolioNavbar';
import { PortfolioFooter } from './PortfolioFooter';
import { ScrollToTop } from './ScrollToTop';

export function PortfolioLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white antialiased">
      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Floating Header */}
      <PortfolioNavbar />

      {/* Page Content Outlet */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Dynamically computed Footer */}
      <PortfolioFooter />
    </div>
  );
}