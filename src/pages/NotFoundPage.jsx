import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FolderGit2, BookOpen, ArrowLeft, Compass } from 'lucide-react';
import { TactileCard } from '../components/portfolio/common/TactileCard';

export function NotFoundPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <TactileCard className="p-8 md:p-14 text-center space-y-6 border-[#E7E2DA] bg-white shadow-[0_1px_3px_rgba(20,20,22,0.03)]">
        {/* Error Monogram / Badge */}
        <div className="h-16 w-16 rounded-2xl bg-[#F4EFEA] border border-[#E7E2DA] flex items-center justify-center mx-auto text-[#C2410C]">
          <Compass className="h-8 w-8 stroke-[1.75]" />
        </div>

        {/* 404 Code & Heading */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#78716C]">
            // HTTP STATUS 404 — NOT FOUND
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141416]">
            Monograph Page Not Found
          </h1>
          <p className="text-sm md:text-base text-[#44403C] max-w-md mx-auto leading-relaxed font-sans">
            The requested technical artifact does not exist, has been revised, or was relocated to an alternative path.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold shadow-xs hover:bg-[#2A2928] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Overview</span>
          </Link>
        </div>

        {/* Helpful Alternate Destinations */}
        <div className="pt-8 border-t border-[#E7E2DA] space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-[#78716C]">
            // Explore alternative monographs:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/projects"
              className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E7E2DA] bg-[#FAF8F5] text-[#44403C] text-xs font-medium hover:border-[#D6CFC4] hover:text-[#141416] transition-colors"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-[#78716C]" />
              <span>Selected Works</span>
            </Link>
            <Link
              to="/blogs"
              className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E7E2DA] bg-[#FAF8F5] text-[#44403C] text-xs font-medium hover:border-[#D6CFC4] hover:text-[#141416] transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#78716C]" />
              <span>Technical Essays</span>
            </Link>
            <Link
              to="/contact"
              className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E7E2DA] bg-[#FAF8F5] text-[#44403C] text-xs font-medium hover:border-[#D6CFC4] hover:text-[#141416] transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-[#78716C]" />
              <span>Direct Inquiries</span>
            </Link>
          </div>
        </div>
      </TactileCard>
    </div>
  );
}

export default NotFoundPage;