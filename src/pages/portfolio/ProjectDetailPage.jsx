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
          { label: 'Projects Archive', href: '/projects' },
          { label: project.title },
        ]}
      />

      {/* 2. Header & Action Links */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#78716C] font-medium font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#A8A29E]" />
              {formatDate(project.updated_at || project.created_at)}
            </span>
            {project.is_featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-semibold text-[11px]">
                ★ Featured Architecture
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#141416] leading-[1.1]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#44403C] leading-relaxed font-normal font-sans">
            {project.summary}
          </p>
        </div>

        {/* Tech Stack Metadata Bar */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 pb-3 border-y border-[#E7E2DA]">
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
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2928] shadow-xs cursor-pointer"
            >
              <span>Launch Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E7E2DA] bg-white text-[#141416] text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#D6CFC4] shadow-xs cursor-pointer"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span>Source Repository</span>
            </a>
          )}
        </div>

        {/* Custom Attached Links List */}
        {project.links && project.links.length > 0 && (
          <div className="pt-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#78716C] block mb-2">
              // Repositories & Specifications:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-[#44403C] text-xs font-medium hover:border-[#D6CFC4] hover:text-[#141416] shadow-2xs"
                >
                  {link.icon_url ? (
                    <img src={link.icon_url} alt="" className="h-3.5 w-3.5 object-contain" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5 text-[#78716C]" />
                  )}
                  <span>{link.label || 'Project Link'}</span>
                  <ExternalLink className="h-3 w-3 text-[#A8A29E]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Hero Browser Frame */}
      {project.thumbnail_url && (
        <div className="my-8">
          <BrowserMockup
            url={project.live_url || `https://${project.slug}.monograph.internal`}
            imageUrl={project.thumbnail_url}
            alt={project.title}
            aspectRatio="aspect-[16/10]"
          />
        </div>
      )}

      {/* 4. Sanitized Rich Case Study Content with Paper Code Inspector */}
      <div className="editorial-prose paper-code-inspector prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#141416] prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl prose-p:text-[#44403C] prose-p:leading-relaxed prose-p:font-sans prose-li:text-[#44403C] prose-strong:text-[#141416] prose-code:font-mono prose-pre:p-0 prose-pre:border-none prose-pre:bg-transparent">
        {sanitizedContent ? (
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        ) : (
          <p className="text-[#78716C] italic font-serif">Detailed architecture writeup forthcoming.</p>
        )}
      </div>

      {/* 5. Continuous Browsing (Previous & Next Navigation) */}
      <div className="pt-12 mt-16 border-t border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject ? (
          <Link
            to={`/projects/${prevProject.slug}`}
            className="p-5 rounded-2xl border border-[#E7E2DA] bg-white hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all group flex flex-col justify-between space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-mono">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              <span>// PREVIOUS SPEC</span>
            </div>
            <span className="font-serif text-base text-[#141416] line-clamp-1 group-hover:text-[#C2410C]">
              {prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            to={`/projects/${nextProject.slug}`}
            className="p-5 rounded-2xl border border-[#E7E2DA] bg-white hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all group flex flex-col justify-between space-y-2 text-right shadow-xs"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-[#78716C] font-mono">
              <span>// NEXT SPEC</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-serif text-base text-[#141416] line-clamp-1 group-hover:text-[#C2410C]">
              {nextProject.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default ProjectDetailPage;