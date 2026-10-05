import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { BrowserMockup } from '../common/BrowserMockup';
import { PastelTag } from '../common/PastelTag';
import { TactileCard } from '../common/TactileCard';

export function ProjectCard({ project }) {
  if (!project) return null;

  return (
    <TactileCard
      as="article"
      className="p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-slate-300"
    >
      <div className="space-y-5">
        {/* Browser Mockup Preview */}
        <Link to={`/projects/${project.slug}`} className="block group">
          <BrowserMockup
            url={project.live_url || `https://${project.slug}.example.com`}
            imageUrl={project.thumbnail_url}
            alt={project.title}
            aspectRatio="aspect-[16/10]"
          />
        </Link>

        {/* Tech Stack Pills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.skills.slice(0, 4).map((skill) => (
              <PastelTag
                key={skill.id || skill.name}
                name={skill.name}
                category={skill.category}
                iconUrl={skill.icon_url}
                size="sm"
              />
            ))}
            {project.skills.length > 4 && (
              <span className="text-[11px] font-medium text-slate-400 self-center px-1">
                +{project.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Project Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight leading-snug">
          <Link
            to={`/projects/${project.slug}`}
            className="hover:underline underline-offset-4 decoration-slate-300"
          >
            {project.title}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
          {project.summary}
        </p>
      </div>

      {/* Action Footer & External Repos */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] active:scale-95 transition-all shadow-xs"
        >
          <span>View Case Study</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit live site for ${project.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Live Demo</span>
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code for ${project.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}

          {/* Render first attached repository link if primary github_url was not provided */}
          {!project.github_url && project.links?.[0]?.url && (
            <a
              href={project.links[0].url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.links[0].label || 'Source Code'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{project.links[0].label || 'Code'}</span>
            </a>
          )}
        </div>
      </div>
    </TactileCard>
  );
}