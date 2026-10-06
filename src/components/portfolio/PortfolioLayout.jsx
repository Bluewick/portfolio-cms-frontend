import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortfolioNavbar } from './PortfolioNavbar';
import { PortfolioFooter } from './PortfolioFooter';
import { ScrollToTop } from './ScrollToTop';

export function PortfolioLayout() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141416] flex flex-col selection:bg-[#FFF7ED] selection:text-[#C2410C] font-sans antialiased">
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