import React from 'react';
import { TactileCard } from '../common/TactileCard';
import { ContactForm } from '../contact/ContactForm';
import { ContactInfoCard } from '../contact/ContactInfoCard';

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <TactileCard className="p-8 md:p-12 border-slate-200 shadow-tactile-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Context Information */}
          <div className="lg:col-span-5">
            <ContactInfoCard />
          </div>

          {/* Right Form Engine */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </TactileCard>
    </section>
  );
}