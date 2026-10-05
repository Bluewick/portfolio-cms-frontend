import React from 'react';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { TactileCard } from '../../components/portfolio/common/TactileCard';
import { ContactForm } from '../../components/portfolio/contact/ContactForm';
import { ContactInfoCard } from '../../components/portfolio/contact/ContactInfoCard';

export function ContactPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Contact & Inquiries' }]} />

      {/* Main Container */}
      <TactileCard className="p-8 md:p-14 border-slate-200 shadow-tactile-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <ContactInfoCard />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </TactileCard>
    </div>
  );
}

export default ContactPage;