import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { PastelTag } from '../common/PastelTag';

export function ProjectListIndex({ projects = [] }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Smooth damping interpolation (spring simulation)
  useEffect(() => {
    let frameId;
    const updatePosition = () => {
      setSmoothPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.18,
        y: prev.y + (mousePos.y - prev.y) * 0.18,
      }));
      frameId = requestAnimationFrame(updatePosition);
    };
    frameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frameId);
  }, [mousePos]);

  return (
    <div className="relative border-t border-b border-[#E7E2DA] divide-y divide-[#E7E2DA] bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(20,20,22,0.03)]">
      {/* Floating Cursor Thumbnail Preview (Hidden on touch devices, active on hover) */}
      {hoveredProject?.thumbnail_url && (
        <div
          className="fixed pointer-events-none z-50 transition-opacity duration-200 hidden md:block"
          style={{
            left: `${smoothPos.x + 24}px`,
            top: `${smoothPos.y - 70}px`,
            opacity: hoveredProject ? 1 : 0,
            transform: 'rotate(-2deg)',
          }}
        >
          <div className="w-[220px] h-[140px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(20,20,22,0.18)] border-2 border-white bg-[#FAF8F5]">
            <img
              src={hoveredProject.thumbnail_url}
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      )}

      {projects.map((project, idx) => {
        const year = project.created_at
          ? new Date(project.created_at).getFullYear()
          : '2024';

        return (
          <div
            key={project.id || idx}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
            className="group px-6 py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 hover:bg-[#FAF8F5]"
          >
            {/* Left: Index number + Title + Year */}
            <div className="flex items-start md:items-center gap-4 md:gap-6 min-w-0">
              <span className="font-mono text-xs text-[#A8A29E] font-medium pt-0.5 md:pt-0">
                // {String(idx + 1).padStart(2, '0')}
              </span>

              <div className="space-y-1 min-w-0">
                <Link
                  to={`/projects/${project.slug}`}
                  className="font-serif text-lg md:text-xl font-normal text-[#141416] group-hover:text-[#C2410C] transition-colors flex items-center gap-2"
                >
                  <span className="truncate">{project.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 text-[#C2410C]" />
                </Link>
                <p className="text-xs text-[#78716C] line-clamp-1 max-w-xl font-sans">
                  {project.summary}
                </p>
              </div>
            </div>

            {/* Right: Category/Skills + Year + External Actions */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-8 md:pl-0">
              {project.skills && project.skills.length > 0 && (
                <div className="hidden lg:flex items-center gap-1.5">
                  {project.skills.slice(0, 2).map((s) => (
                    <PastelTag
                      key={s.id || s.name}
                      name={s.name}
                      category={s.category}
                      size="sm"
                    />
                  ))}
                </div>
              )}

              <span className="font-mono text-xs text-[#78716C] bg-[#F4EFEA] px-2.5 py-0.5 rounded-full border border-[#E7E2DA]">
                {year}
              </span>

              <div className="flex items-center gap-2">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Live Demo"
                    className="p-1.5 rounded-full text-[#78716C] hover:text-[#141416] hover:bg-[#EFECE6] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Source Repository"
                    className="p-1.5 rounded-full text-[#78716C] hover:text-[#141416] hover:bg-[#EFECE6] transition-colors"
                  >
                    <FaGithub className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
