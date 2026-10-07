import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
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
import { 
  ProjectContentRenderer, 
  slugify 
} from '../../components/portfolio/projects/ProjectContentRenderer';
import { TableOfContents } from '../../components/portfolio/blogs/TableOfContents';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// Helper: Extracts all H2 and H3 headings for the Table of Contents Outline
function extractHeadingsFromHtml(html) {
  if (!html) return [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      headings.push({ id: slugify(text), text, level });
    }
  }
  return headings;
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, isLoading, error } = useProjectDetails(slug);
  const { data: allProjects = [] } = useProjects();

  const [readingProgress, setReadingProgress] = useState(0);

  // Track scroll progress for the fixed top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sanitizedContent = useMemo(() => {
    return project?.content ? sanitizeHtml(project.content) : '';
  }, [project?.content]);

  const headings = useMemo(() => {
    return extractHeadingsFromHtml(sanitizedContent);
  }, [sanitizedContent]);

  // 404 / Not Found Fallback
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

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-8">
        <SkeletonLoader variant="text" count={2} />
        <div className="aspect-[16/10] w-full rounded-3xl bg-slate-100 animate-pulse" />
        <SkeletonLoader variant="text" count={5} />
      </div>
    );
  }

  // Previous and Next project navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <>
      {/* 1. Hairline Reading Progress Bar (Fixed Top) */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#C2410C] z-50 transition-all duration-75 origin-left"
        style={{ width: `${readingProgress}%` }}
      />

      <article className="pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* 2. Breadcrumbs (Centered) */}
        <div className="max-w-3xl mx-auto w-full">
          <Breadcrumb
            items={[
              { label: 'Projects Archive', href: '/projects' },
              { label: project.title },
            ]}
          />
        </div>

        {/* 3. Header & Action Links (Centered) */}
        <header className="space-y-6 max-w-3xl mx-auto w-full">
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

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-[#141416] leading-[1.12]">
              {project.title}
            </h1>

            {project.summary && (
              <p className="text-xl sm:text-2xl text-[#44403C] leading-relaxed font-serif italic">
                {project.summary}
              </p>
            )}
          </div>

          {/* Tech Stack Metadata Pills */}
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
                className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2928] shadow-xs cursor-pointer transition-colors"
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
                className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E7E2DA] bg-white text-[#141416] text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#D6CFC4] shadow-xs cursor-pointer transition-colors"
              >
                <FaGithub className="h-3.5 w-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          {/* Attached Repository & Spec Links */}
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
                    className="btn-press inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-[#44403C] text-xs font-medium hover:border-[#D6CFC4] hover:text-[#141416] shadow-2xs transition-colors"
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
        </header>

        {/* 4. Hero Browser Frame (Centered) */}
        {project.thumbnail_url && (
          <div className="max-w-4xl mx-auto w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E2DA] bg-[#F4EFEA] shadow-xs">
            <BrowserMockup
              url={project.live_url || `https://${project.slug}.monograph.internal`}
              imageUrl={project.thumbnail_url}
              alt={project.title}
              aspectRatio="aspect-[16/10]"
            />
          </div>
        )}

        {/* 5. Symmetrical 3-Column Layout: Left Spacer / Centered Case Study / Right Sticky TOC */}
        <div className="xl:grid xl:grid-cols-[240px_minmax(0,1fr)_240px] xl:gap-10 items-start">
          {/* Left Column: Symmetrical rail with sticky back link to guarantee dead-center alignment */}
          <div className="hidden xl:block">
            <div className="sticky top-28 self-start">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#78716C] hover:text-[#C2410C] transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span>All Projects</span>
              </Link>
            </div>
          </div>

          {/* Center Column: Perfectly Centered Technical Content */}
          <div className="min-w-0 max-w-3xl mx-auto w-full">
            {/* Mobile / Tablet Collapsible Outline */}
            {headings.length > 0 && (
              <TableOfContents headings={headings} variant="mobile" />
            )}

            {/* Rich Case Study Content with Paper Code Inspector */}
            <ProjectContentRenderer 
              rawContent={sanitizedContent} 
              projectTitle={project.title} 
            />
          </div>

          {/* Right Column: Desktop Sticky Outline Rail */}
          <div className="hidden xl:block">
            {headings.length > 0 ? (
              <TableOfContents headings={headings} variant="desktop" />
            ) : (
              <div className="w-[240px]" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* 6. Previous & Next Project Navigation (Centered) */}
        <div className="max-w-3xl mx-auto w-full pt-12 mt-16 border-t border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </>
  );
}

export default ProjectDetailPage;