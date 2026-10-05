import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FolderGit2, BookOpen, ArrowLeft, Compass } from 'lucide-react';
import { TactileCard } from '../components/portfolio/common/TactileCard';

export function NotFoundPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <TactileCard className="p-8 md:p-14 text-center space-y-6 border-slate-200 shadow-tactile-card">
        {/* Error Monogram / Badge */}
        <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
          <Compass className="h-8 w-8 stroke-[1.75]" />
        </div>

        {/* 404 Code & Heading */}
        <div className="space-y-2">
          <span className="font-code text-xs font-semibold uppercase tracking-widest text-slate-400">
            HTTP Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a]">
            Resource Not Found
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            The page or asset you requested does not exist, has been drafted, or has moved to an alternative endpoint.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] text-white text-xs font-semibold shadow-xs hover:bg-[#1e293b] active:scale-95 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>

        {/* Helpful Alternate Destinations */}
        <div className="pt-8 border-t border-slate-100 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Explore alternate sections:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Projects Gallery</span>
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>Technical Articles</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-slate-400" />
              <span>Direct Contact</span>
            </Link>
          </div>
        </div>
      </TactileCard>
    </div>
  );
}

export default NotFoundPage;