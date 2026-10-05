import React from 'react';
import { Quote } from 'lucide-react';
import { useTestimonials } from '../../../hooks/usePortfolio';
import { TactileCard } from '../common/TactileCard';

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useTestimonials();

  // Ghost Section Check: Omit if empty
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  const sortedTestimonials = [...testimonials].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // 05. PEER TESTIMONIALS & ENDORSEMENTS
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
          Colleague & engineering <em className="italic font-serif text-[#C2410C]">verifications</em>.
        </h2>
        <p className="text-sm md:text-base text-[#44403C] font-sans">
          Testimony from engineering leaders, architects, and collaborators on production deliverables and architectural impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTestimonials.map((item) => (
          <TactileCard key={item.id} className="p-8 flex flex-col justify-between space-y-6 bg-white border-[#E7E2DA]">
            <Quote className="h-7 w-7 text-[#D97706] stroke-[1.5]" />

            <p className="font-serif text-base md:text-lg text-[#141416] italic leading-relaxed">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E7E2DA]">
              {item.avatar_url ? (
                <img
                  src={item.avatar_url}
                  alt={item.client_name}
                  className="h-10 w-10 rounded-full object-cover border border-[#E7E2DA] aspect-square"
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#141416] text-[#FAF8F5] font-serif font-bold flex items-center justify-center text-xs">
                  {item.client_name?.[0] || 'C'}
                </div>
              )}
              <div>
                <h3 className="font-serif font-bold text-sm text-[#141416]">
                  {item.client_name}
                </h3>
                <p className="text-xs text-[#78716C] font-sans font-medium">
                  {item.client_title} {item.company ? `• ${item.company}` : ''}
                </p>
              </div>
            </div>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}