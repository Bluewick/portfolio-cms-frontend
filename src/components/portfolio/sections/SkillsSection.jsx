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
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // 04. TECHNICAL CAPABILITIES & TAXONOMY
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
          Specialized stack for <em className="italic font-serif text-[#C2410C]">production scale</em>.
        </h2>
        <p className="text-sm md:text-base text-[#44403C] font-sans">
          A rigorous taxonomy of technologies deployed across high-throughput distributed architectures, transaction storage, and cloud infrastructure.
        </p>
      </div>

      {/* Categorized Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSkills).map(([category, items]) => (
          <TactileCard key={category} className="p-6 space-y-4 bg-white border-[#E7E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
              <h3 className="font-mono text-xs font-semibold text-[#141416] uppercase tracking-wider">
                // {category}
              </h3>
              <span className="text-[11px] font-mono text-[#78716C] bg-[#F4EFEA] px-2 py-0.5 rounded-full border border-[#E7E2DA]">
                {items.length} {items.length === 1 ? 'spec' : 'specs'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
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