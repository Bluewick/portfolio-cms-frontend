import React from 'react';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import { useExperiences } from '../../../hooks/usePortfolio';
import { TactileCard } from '../common/TactileCard';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function ExperienceSection() {
  const { data: experiences = [], isLoading } = useExperiences();

  // Ghost Section Check: Omit if empty
  if (!isLoading && experiences.length === 0) {
    return null;
  }

  const sortedExperiences = [...experiences].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Work History</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Career & Technical Leadership
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          Roles where I took ownership of system architecture, database performance, and team engineering standards.
        </p>
      </div>

      <div className="space-y-4">
        {sortedExperiences.map((exp) => {
          const startDate = formatDate(exp.start_date);
          const endDate = exp.is_current ? 'Present' : formatDate(exp.end_date);

          return (
            <TactileCard
              key={exp.id}
              className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Role & Company */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg md:text-xl font-bold text-[#0f172a]">
                      {exp.role}
                    </h3>
                    {exp.is_current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs md:text-sm text-slate-600 font-medium">
                    <span className="flex items-center gap-1 text-slate-900 font-semibold">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date Badge Pill */}
                <div className="shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-code font-medium text-slate-700">
                    {startDate} — {endDate}
                  </span>
                </div>
              </div>

              {/* Achievements Description */}
              {exp.description && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed font-normal">
                  <p>{exp.description}</p>
                </div>
              )}
            </TactileCard>
          );
        })}
      </div>
    </section>
  );
}