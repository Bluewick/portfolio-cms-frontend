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
      className="p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-[#D6CFC4] bg-white border-[#E7E2DA]"
    >
      <div className="space-y-5">
        {/* Browser Mockup Preview */}
        <Link to={`/projects/${project.slug}`} className="block group">
          <BrowserMockup
            url={project.live_url || `https://${project.slug}.monograph.internal`}
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
              <span className="text-[11px] font-mono text-[#78716C] self-center px-1">
                +{project.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Project Title in Editorial Serif */}
        <h3 className="font-serif text-xl md:text-2xl font-normal text-[#141416] tracking-tight leading-snug">
          <Link
            to={`/projects/${project.slug}`}
            className="hover:text-[#C2410C] transition-colors"
          >
            {project.title}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="text-sm text-[#44403C] leading-relaxed font-normal line-clamp-3 font-sans">
          {project.summary}
        </p>
      </div>

      {/* Action Footer & External Repos */}
      <div className="pt-4 border-t border-[#E7E2DA] flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/projects/${project.slug}`}
          className="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2928] shadow-xs cursor-pointer"
        >
          <span>View Spec</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit live site for ${project.title}`}
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] text-xs font-medium hover:bg-[#FAF8F5] hover:text-[#141416] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#78716C]" />
              <span className="hidden sm:inline">Live Demo</span>
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code for ${project.title}`}
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] text-xs font-medium hover:bg-[#FAF8F5] hover:text-[#141416] transition-colors"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}
        </div>
      </div>
    </TactileCard>
  );
}