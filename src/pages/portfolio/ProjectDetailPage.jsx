import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  FolderGit2, 
  Link2,
  AlertCircle
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { useProjectDetails, useProjects } from '../../hooks/usePortfolio';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { BrowserMockup } from '../../components/portfolio/common/BrowserMockup';
import { PastelTag } from '../../components/portfolio/common/PastelTag';
import { TactileCard } from '../../components/portfolio/common/TactileCard';
import { SkeletonLoader } from '../../components/portfolio/common/SkeletonLoader';
import { sanitizeHtml } from '../../lib/sanitize';
import { highlightAll } from '../../lib/prism';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, isLoading, error } = useProjectDetails(slug);
  const { data: allProjects = [] } = useProjects();

  // Run Prism syntax highlighting on sanitized HTML code blocks
  useEffect(() => {
    if (project?.content) {
      highlightAll();
    }
  }, [project?.content]);

  // 404 / Draft Not Found State Handling
  if (error || (!isLoading && !project)) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-3xl mx-auto text-center space-y-6">
        <Breadcrumb items={[{ label: 'Projects', href: '/projects' }, { label: 'Not Found' }]} />
        <TactileCard className="p-10 md:p-14 space-y-5">
          <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
            Case Study Not Found
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The project "{slug}" could not be located. It may be unpublished, archived, or the link may have expired.
          </p>
          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-all shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Projects Archive</span>
            </Link>
          </div>
        </TactileCard>
      </div>
    );
  }

  // Loading Skeleton State (Zero CLS)
  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-8">
        <SkeletonLoader variant="text" count={2} />
        <div className="aspect-[16/10] w-full rounded-3xl bg-slate-100 animate-pulse" />
        <SkeletonLoader variant="text" count={5} />
      </div>
    );
  }

  // Calculate Previous and Next projects for continuous browsing
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const sanitizedContent = sanitizeHtml(project.content);

  return (
    <article className="pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/projects' },
          { label: project.title },
        ]}
      />

      {/* 2. Header & Action Links */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 font-code">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {formatDate(project.updated_at || project.created_at)}
            </span>
            {project.is_featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                Featured Architecture
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] leading-[1.15]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {project.summary}
          </p>
        </div>

        {/* Tech Stack Metadata Bar */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-2 border-y border-slate-100">
            {project.skills.map((skill) => (
              <PastelTag
                key={skill.id || skill.name}
                name={skill.name}
                category={skill.category}
                iconUrl={skill.icon_url}
                size="md"
              />
            ))}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] active:scale-95 transition-all shadow-xs"
            >
              <span>Launch Live Project</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span>Repository</span>
            </a>
          )}
        </div>

        {/* Custom Attached Links List (e.g., Frontend & Backend repos) */}
        {project.links && project.links.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Architecture & Source Repositories:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  {link.icon_url ? (
                    <img src={link.icon_url} alt="" className="h-3.5 w-3.5 object-contain" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span>{link.label || 'Project Link'}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Hero Browser Frame / Media Display */}
      {project.thumbnail_url && (
        <div className="my-8">
          <BrowserMockup
            url={project.live_url || `https://${project.slug}.example.com`}
            imageUrl={project.thumbnail_url}
            alt={project.title}
            aspectRatio="aspect-[16/10]"
          />
        </div>
      )}

      {/* 4. Sanitized Rich Case Study Content */}
      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#0f172a] prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-code:font-code prose-pre:p-0 prose-pre:border-none prose-pre:bg-transparent">
        {sanitizedContent ? (
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        ) : (
          <p className="text-slate-500 italic">Detailed architecture writeup forthcoming.</p>
        )}
      </div>

      {/* 5. Continuous Browsing (Previous & Next Navigation) */}
      <div className="pt-12 mt-16 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject ? (
          <Link
            to={`/projects/${prevProject.slug}`}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all group flex flex-col justify-between space-y-2 shadow-tactile-card"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              <span>Previous Project</span>
            </div>
            <span className="font-bold text-sm text-[#0f172a] line-clamp-1 group-hover:underline">
              {prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            to={`/projects/${nextProject.slug}`}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all group flex flex-col justify-between space-y-2 text-right shadow-tactile-card"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-medium">
              <span>Next Project</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-bold text-sm text-[#0f172a] line-clamp-1 group-hover:underline">
              {nextProject.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default ProjectDetailPage;