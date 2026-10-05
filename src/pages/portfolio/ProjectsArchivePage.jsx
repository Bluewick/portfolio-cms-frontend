import React, { useState, useMemo } from 'react';
import { Search, FolderGit2, X, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { useProjects } from '../../hooks/usePortfolio';
import { ProjectCard } from '../../components/portfolio/projects/ProjectCard';
import { ProjectListIndex } from '../../components/portfolio/projects/ProjectListIndex';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { SkeletonLoader } from '../../components/portfolio/common/SkeletonLoader';
import { cn } from '../../lib/utils';

export function ProjectsArchivePage() {
  const { data: projects = [], isLoading } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
      <Breadcrumb items={[{ label: 'Projects Archive' }]} />

      {/* Page Title & Count Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // ARCHIVE DIRECTORY & CASE STUDIES
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#141416] leading-[1.1]">
          Software Systems & <em className="italic font-serif text-[#C2410C]">Architectures</em>
        </h1>
        <p className="text-base text-[#44403C] leading-relaxed font-normal font-sans">
          A publication-grade gallery of production distributed platforms, developer tools, and microservice infrastructure built for scale and durability.
        </p>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="space-y-4 p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-[#E7E2DA] shadow-[0_1px_3px_rgba(20,20,22,0.03)]">
        {/* Search Input + View Format Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, architecture, or domain..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E7E2DA] bg-[#FAF8F5] text-sm text-[#141416] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#141416] focus:outline-hidden transition-colors font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#141416] p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Format Toggle Pill */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#F4EFEA] border border-[#E7E2DA] self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer font-mono',
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
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer font-mono',
                viewMode === 'list'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>Index</span>
            </button>
          </div>
        </div>

        {/* Skill Tag Pills */}
        {availableSkills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#E7E2DA]">
            <span className="font-mono text-xs text-[#78716C] uppercase tracking-wider mr-1">
              Filter:
            </span>

            {/* "All" Filter Button */}
            <button
              type="button"
              onClick={() => setSelectedSkill('ALL')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer font-mono',
                selectedSkill === 'ALL'
                  ? 'bg-[#141416] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#F4EFEA] text-[#44403C] hover:bg-[#EFECE6]'
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
                    'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer font-mono',
                    isSelected
                      ? 'bg-[#C2410C] text-[#FAF8F5] shadow-xs'
                      : 'bg-[#F4EFEA] text-[#44403C] hover:bg-[#EFECE6]'
                  )}
                >
                  {skillName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid or List Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonLoader variant="card" count={4} />
        </div>
      ) : filteredProjects.length > 0 ? (
        viewMode === 'list' ? (
          <ProjectListIndex projects={filteredProjects} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )
      ) : (
        /* Empty Search / Filter State */
        <div className="text-center py-16 px-4 rounded-3xl border border-[#E7E2DA] bg-white shadow-[0_1px_3px_rgba(20,20,22,0.03)] space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto text-[#78716C]">
            <Search className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-normal text-[#141416]">No matching projects located</h3>
            <p className="text-sm text-[#78716C] max-w-sm mx-auto font-sans">
              No entries matched "{searchQuery || selectedSkill}". Try resetting your filter query.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-press inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2928] cursor-pointer"
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