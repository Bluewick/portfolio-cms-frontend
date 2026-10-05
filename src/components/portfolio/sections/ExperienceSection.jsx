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
      <div className="space-y-3 mb-16 text-center max-w-2xl mx-auto">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // 02. CAREER TIMELINE & FIELD NOTES
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
          Technical leadership & <em className="italic font-serif text-[#C2410C]">production tenure</em>.
        </h2>
        <p className="text-sm md:text-base text-[#44403C] font-sans">
          Engineering roles where I took operational ownership of distributed backend systems, query optimization, and team architectural standards.
        </p>
      </div>

      {/* Editorial Timeline with Hairline Connecting Rule and Circular Notches */}
      <div className="relative max-w-4xl mx-auto">
        {/* Soft vertical connecting rule */}
        <div className="absolute left-4 md:left-[170px] top-4 bottom-4 w-px bg-[#E7E2DA]" />

        <div className="space-y-12">
          {sortedExperiences.map((exp) => {
            const startDate = formatDate(exp.start_date);
            const endDate = exp.is_current ? 'Present' : formatDate(exp.end_date);

            return (
              <div
                key={exp.id}
                className="relative pl-12 md:pl-0 md:grid md:grid-cols-[170px_1fr] md:gap-12 items-start group"
              >
                {/* Circular Notch Node */}
                <div className="absolute left-4 md:left-[170px] top-1.5 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#FAF8F5] border-2 border-[#141416] group-hover:border-[#C2410C] group-hover:scale-110 transition-all z-10">
                  {exp.is_current && (
                    <span className="absolute inset-0.5 rounded-full bg-[#16A34A] animate-pulse" />
                  )}
                </div>

                {/* Left Column: Date Range in meta-mono */}
                <div className="md:text-right pr-6 space-y-1">
                  <div className="font-mono text-xs font-semibold text-[#141416]">
                    {startDate} — {endDate}
                  </div>
                  {exp.is_current && (
                    <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">
                      Active
                    </span>
                  )}
                </div>

                {/* Right Column: Role, Company, Location & Achievements */}
                <div className="mt-2 md:mt-0 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#E7E2DA] shadow-[0_1px_3px_rgba(20,20,22,0.03)] hover:border-[#D6CFC4] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E7E2DA]">
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl font-normal text-[#141416]">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-[#44403C] font-medium pt-1 font-sans">
                        <span className="font-semibold text-[#141416] flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-[#78716C]" />
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="text-[#78716C] flex items-center gap-1">
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mt-4 text-sm text-[#44403C] leading-relaxed font-normal font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}