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
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Client & Colleague Endorsements
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          Feedback from technology leaders and team collaborators on production results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTestimonials.map((item) => (
          <TactileCard key={item.id} className="p-8 flex flex-col justify-between space-y-6">
            <Quote className="h-7 w-7 text-slate-300 stroke-[1.5]" />

            <p className="text-slate-700 text-sm md:text-base italic leading-relaxed">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              {item.avatar_url ? (
                <img
                  src={item.avatar_url}
                  alt={item.client_name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 aspect-square"
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  {item.client_name?.[0] || 'C'}
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm text-[#0f172a]">
                  {item.client_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
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