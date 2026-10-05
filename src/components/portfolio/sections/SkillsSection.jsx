import React from 'react';
import { Cpu } from 'lucide-react';
import { useSkills } from '../../../hooks/usePortfolio';
import { PastelTag } from '../common/PastelTag';
import { TactileCard } from '../common/TactileCard';

export function SkillsSection() {
  const { data: skills = [], isLoading } = useSkills();

  // Ghost Section Check
  if (!isLoading && skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Cpu className="h-3.5 w-3.5" />
          <span>Technical Capabilities</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Engineered for production scale.
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          A focused taxonomy of technologies I deploy to build resilient cloud applications.
        </p>
      </div>

      {/* Categorized Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSkills).map(([category, items]) => (
          <TactileCard key={category} className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-[#0f172a] uppercase tracking-wider font-sans">
                {category}
              </h3>
              <span className="text-xs font-code text-slate-400 font-medium">
                {items.length} {items.length === 1 ? 'skill' : 'skills'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((skill) => (
                  <PastelTag
                    key={skill.id}
                    name={skill.name}
                    category={skill.category}
                    iconUrl={skill.icon_url}
                  />
                ))}
            </div>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}