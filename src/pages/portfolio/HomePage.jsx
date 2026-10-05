import React from 'react';
import { HeroSection } from '../../components/portfolio/sections/HeroSection';
import { BentoGridSection } from '../../components/portfolio/sections/BentoGridSection';
import { SkillsSection } from '../../components/portfolio/sections/SkillsSection';
import { FeaturedProjectsSection } from '../../components/portfolio/sections/FeaturedProjectsSection';
import { ExperienceSection } from '../../components/portfolio/sections/ExperienceSection';
import { ServicesSection } from '../../components/portfolio/sections/ServicesSection';
import { TestimonialsSection } from '../../components/portfolio/sections/TestimonialsSection';
import { LatestBlogsSection } from '../../components/portfolio/sections/LatestBlogsSection';
import { ContactSection } from '../../components/portfolio/sections/ContactSection';
export function HomePage() {
  return (
    <div className="w-full space-y-4 md:space-y-8">
      {/* 1. Hero Pitch & Terminal specs */}
      <HeroSection />

      {/* 2. Engineering Impact Bento Grid */}
      <BentoGridSection />

      {/* 3. Categorized Skills Matrix */}
      <SkillsSection />

      {/* 4. Featured Case Studies */}
      <FeaturedProjectsSection />

      {/* 5. Work Experience Timeline */}
      <ExperienceSection />

      {/* 6. Service Offerings (Conditional) */}
      <ServicesSection />

      {/* 7. Client Testimonials (Conditional) */}
      <TestimonialsSection />

      {/* 8. Recent Technical Writing (Conditional) */}
      <LatestBlogsSection />

      {/* 9. Direct Contact & Booking */}
      <ContactSection />
    </div>
  );
}

export default HomePage;