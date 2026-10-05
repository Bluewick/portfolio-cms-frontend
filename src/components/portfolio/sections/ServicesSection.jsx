import React from 'react';
import { Layers, Server } from 'lucide-react';
import { useServices } from '../../../hooks/usePortfolio';
import { TactileCard } from '../common/TactileCard';

export function ServicesSection() {
  const { data: services = [], isLoading } = useServices();

  // Ghost Section Check: Omit if empty
  if (!isLoading && services.length === 0) {
    return null;
  }

  const sortedServices = [...services].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <section id="services" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // 03. CONSULTING SCOPE & ADVISORY
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
          Specialized <em className="italic font-serif text-[#C2410C]">engineering</em> engagements.
        </h2>
        <p className="text-sm md:text-base text-[#44403C] font-sans">
          Targeted production scopes designed to unblock scalability bottlenecks, audit database integrity, and architect fault-tolerant distributed backends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <TactileCard key={service.id} className="p-7 md:p-8 space-y-5 bg-white border-[#E7E2DA]">
            {/* Icon Box Header with Warm Circular Container */}
            <div className="h-12 w-12 rounded-full bg-[#F4EFEA] border border-[#E7E2DA] flex items-center justify-center text-[#C2410C]">
              {service.icon_url ? (
                <img
                  src={service.icon_url}
                  alt=""
                  className="h-5 w-5 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Server className="h-5 w-5 text-[#C2410C] stroke-[2]" />
              )}
            </div>

            <h3 className="font-serif text-xl font-normal text-[#141416] tracking-tight">
              {service.title}
            </h3>

            <p className="text-sm text-[#44403C] leading-relaxed font-normal font-sans">
              {service.description}
            </p>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}