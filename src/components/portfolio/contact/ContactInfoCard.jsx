import React, { useState } from 'react';
import { Copy, Check, Mail, Globe, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAbout } from '../../../hooks/usePortfolio';
import { SocialIconLink } from '../common/SocialIconLink';

export function ContactInfoCard() {
  const { data: about } = useAbout();
  const [copied, setCopied] = useState(false);

  // Fallback public direct contact email
  const contactEmail = 'alex.mercer@example.com';

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
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Inquiries & Contracts
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a] leading-tight">
          Let’s build reliable software together.
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          Available for senior backend engineering contracts, architectural reviews, PostgreSQL optimization, and technical advisory.
        </p>
      </div>

      {/* Direct Metadata Stack */}
      <div className="space-y-3 pt-2">
        {/* Copyable Email Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Direct Contact
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-800 font-code">
                {contactEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Global Remote Badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
          <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Location & Remote Work
            </p>
            <p className="text-xs md:text-sm font-medium text-slate-800">
              San Francisco, CA (Remote Globally)
            </p>
          </div>
        </div>

        {/* Response SLA */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
          <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Response Guarantee
            </p>
            <p className="text-xs md:text-sm font-medium text-slate-800">
              Within 24 business hours
            </p>
          </div>
        </div>
      </div>

      {/* Social Handles */}
      <div className="pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
          Verified Profiles:
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