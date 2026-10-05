import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { useProjects } from '../../../hooks/usePortfolio';
import { BrowserMockup } from '../common/BrowserMockup';
import { PastelTag } from '../common/PastelTag';
import { TactileCard } from '../common/TactileCard';

export function FeaturedProjectsSection() {
  const { data: projects = [], isLoading } = useProjects();

  // Ghost Section Check: Omit if zero items
  if (!isLoading && projects.length === 0) {
    return null;
  }

  // Filter featured or take top 2
  const featured = projects
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const displayList = featured.length > 0 ? featured.slice(0, 2) : projects.slice(0, 2);

  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Featured Case Studies</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a]">
            Highlighted Engineering Work
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl">
            Selected software platforms designed with emphasis on concurrency, clean domain modeling, and scale.
          </p>
        </div>

        {/* View All Projects link (rendered only if > 0 projects exist) */}
        {projects.length > 0 && (
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a] hover:text-slate-600 transition-colors group self-start md:self-auto"
          >
            <span>Browse All {projects.length} Projects</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Project Cards Stack */}
      <div className="space-y-12">
        {displayList.map((project) => (
          <TactileCard
            key={project.id}
            className="p-6 md:p-10 border-slate-200 hover:border-slate-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Media Browser Frame */}
              <div className="lg:col-span-7">
                <Link to={`/projects/${project.slug}`} className="block group">
                  <BrowserMockup
                    url={project.live_url || `https://${project.slug}.example.com`}
                    imageUrl={project.thumbnail_url}
                    alt={project.title}
                  />
                </Link>
              </div>

              {/* Project Meta & Details */}
              <div className="lg:col-span-5 space-y-4">
                {/* Tech Pills */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.slice(0, 4).map((skill) => (
                      <PastelTag
                        key={skill.id}
                        name={skill.name}
                        category={skill.category}
                        iconUrl={skill.icon_url}
                        size="sm"
                      />
                    ))}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="hover:underline underline-offset-4 decoration-slate-300"
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {project.summary}
                </p>

                {/* Action Links */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-all shadow-xs"
                  >
                    <span>Read Architecture Spec</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                      <span>Live Site</span>
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <FaGithub className="h-3.5 w-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}