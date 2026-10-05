import React, { useState } from 'react';
import { Copy, Check, Mail, Globe, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAbout } from '../../../hooks/usePortfolio';
import { SocialIconLink } from '../common/SocialIconLink';

export function ContactInfoCard() {
  const { data: about } = useAbout();
  const [copied, setCopied] = useState(false);

  // Fallback public direct contact email
  const contactEmail = 'alex.mercer@technical-monograph.io';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      toast.success('Email copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy email');
    }
  };

  const socialLinks = about?.social_links || {};

  return (
    <div className="space-y-6">
      {/* Pitch Header */}
      <div className="space-y-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          // DIRECT CORRESPONDENCE
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[#141416] leading-tight">
          Initiate a <em className="italic font-serif text-[#C2410C]">technical inquiry</em>.
        </h2>
        <p className="text-sm text-[#44403C] leading-relaxed font-normal font-sans">
          Available for principal systems engineering contracts, database bottleneck profiling, distributed architecture reviews, and high-concurrency consulting.
        </p>
      </div>

      {/* Direct Metadata Stack */}
      <div className="space-y-3 pt-2">
        {/* Copyable Email Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E7E2DA] bg-[#F4EFEA]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white border border-[#E7E2DA] flex items-center justify-center text-[#141416]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                DIRECT TRANSMISSION
              </p>
              <p className="text-xs md:text-sm font-medium text-[#141416] font-mono">
                {contactEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            className="btn-press p-2 rounded-lg text-[#78716C] hover:text-[#141416] hover:bg-white border border-transparent hover:border-[#E7E2DA] transition-all cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[#16A34A]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Global Remote Badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E7E2DA] bg-[#F4EFEA]">
          <div className="h-8 w-8 rounded-lg bg-white border border-[#E7E2DA] flex items-center justify-center text-[#141416]">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
              HEADQUARTERS & TIMEZONE
            </p>
            <p className="text-xs md:text-sm font-medium text-[#141416] font-sans">
              San Francisco, CA • PST (Remote Globally)
            </p>
          </div>
        </div>

        {/* Response SLA */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E7E2DA] bg-[#F4EFEA]">
          <div className="h-8 w-8 rounded-lg bg-white border border-[#E7E2DA] flex items-center justify-center text-[#141416]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
              GUARANTEED RESPONSE
            </p>
            <p className="text-xs md:text-sm font-medium text-[#141416] font-sans">
              Within 24 business hours
            </p>
          </div>
        </div>
      </div>

      {/* Social Handles */}
      <div className="pt-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] block mb-3">
          // Verified Network:
        </span>
        <div className="flex items-center gap-2">
          {socialLinks.github && (
            <SocialIconLink type="github" url={socialLinks.github} label="GitHub" showLabel />
          )}
          {socialLinks.linkedin && (
            <SocialIconLink type="linkedin" url={socialLinks.linkedin} label="LinkedIn" showLabel />
          )}
          {socialLinks.twitter && (
            <SocialIconLink type="twitter" url={socialLinks.twitter} label="Twitter / X" showLabel />
          )}
        </div>
      </div>
    </div>
  );
}