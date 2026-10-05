import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid, List } from 'lucide-react';
import { useProjects } from '../../../hooks/usePortfolio';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectListIndex } from '../projects/ProjectListIndex';
import { cn } from '../../../lib/utils';

export function FeaturedProjectsSection() {
  const { data: projects = [], isLoading } = useProjects();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Ghost Section Check: Omit if zero items
  if (!isLoading && projects.length === 0) {
    return null;
  }

  // Filter featured or take top 4
  const featured = projects
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const displayList = featured.length > 0 ? featured.slice(0, 4) : projects.slice(0, 4);

  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E7E2DA] pb-8">
        <div className="space-y-3">
          <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
            // 01. SELECTED WORKS
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
            Highlighted <em className="italic font-serif text-[#C2410C]">engineering</em> platforms.
          </h2>
          <p className="text-sm md:text-base text-[#44403C] max-w-xl font-sans">
            Production systems designed with an emphasis on low concurrency contention, clean domain modeling, and scale.
          </p>
        </div>

        {/* View Toggle + View All Link */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Format Selector: Segmented Pill */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#F4EFEA] border border-[#E7E2DA]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer font-mono',
                viewMode === 'grid'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer font-mono',
                viewMode === 'list'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>Editorial Index</span>
            </button>
          </div>

          {projects.length > 0 && (
            <Link
              to="/projects"
              className="btn-press inline-flex items-center gap-1 text-xs font-semibold font-sans text-[#141416] hover:text-[#C2410C] transition-colors group"
            >
              <span>All ({projects.length})</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Projects Display: List Index or Visual Grid */}
      {viewMode === 'list' ? (
        <ProjectListIndex projects={displayList} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}