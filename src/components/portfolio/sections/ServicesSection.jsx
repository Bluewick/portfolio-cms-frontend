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
    <section id="services" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-3 mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Layers className="h-3.5 w-3.5" />
          <span>Consulting & Offerings</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Specialized Engineering Services
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          Targeted technical engagements designed to unblock scale and harden critical software infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <TactileCard key={service.id} className="p-6 md:p-8 space-y-4">
            {/* Icon Box Header */}
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
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
                <Server className="h-5 w-5 text-slate-700" />
              )}
            </div>

            <h3 className="text-lg font-bold text-[#0f172a]">
              {service.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {service.description}
            </p>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}