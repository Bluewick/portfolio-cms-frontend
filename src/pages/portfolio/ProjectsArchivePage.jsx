import React, { useState, useMemo } from 'react';
import { Search, FolderGit2, X, RefreshCw } from 'lucide-react';
import { useProjects } from '../../hooks/usePortfolio';
import { ProjectCard } from '../../components/portfolio/projects/ProjectCard';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { SkeletonLoader } from '../../components/portfolio/common/SkeletonLoader';
import { cn } from '../../lib/utils';

export function ProjectsArchivePage() {
  const { data: projects = [], isLoading } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  // Extract unique skill names across all published projects
  const availableSkills = useMemo(() => {
    const skillSet = new Set();
    projects.forEach((p) => {
      p.skills?.forEach((s) => {
        if (s.name) skillSet.add(s.name);
      });
    });
    return Array.from(skillSet).sort();
  }, [projects]);

  // Filter projects by search query and selected skill
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill =
        selectedSkill === 'ALL' ||
        project.skills?.some(
          (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
        );

      return matchesSearch && matchesSkill;
    });
  }, [projects, searchQuery, selectedSkill]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('ALL');
  };

  return (
    <div className="pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Accessible Breadcrumb */}
      <Breadcrumb items={[{ label: 'Projects' }]} />

      {/* Page Title & Count Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <FolderGit2 className="h-3.5 w-3.5" />
          <span>Engineering Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] leading-tight">
          Software Systems & Applications
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          A comprehensive gallery of production systems, developer tools, and microservice architectures built for scale and resilience.
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="space-y-4 p-5 md:p-6 rounded-2xl bg-white border border-slate-200 shadow-tactile-card">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, architecture, or domain..."
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0f172a] focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Skill Tag Pills */}
        {availableSkills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>

            {/* "All" Filter Button */}
            <button
              type="button"
              onClick={() => setSelectedSkill('ALL')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
                selectedSkill === 'ALL'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              All ({projects.length})
            </button>

            {availableSkills.map((skillName) => {
              const isSelected = selectedSkill.toLowerCase() === skillName.toLowerCase();
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => setSelectedSkill(isSelected ? 'ALL' : skillName)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {skillName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid of Project Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonLoader variant="card" count={4} />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="text-center py-16 px-4 rounded-3xl border border-slate-200 bg-white shadow-tactile-card space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0f172a]">No projects matched your filter</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any projects matching "{searchQuery || selectedSkill}". Try clearing your filters.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectsArchivePage;