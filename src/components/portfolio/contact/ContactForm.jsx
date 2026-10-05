import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useContactMutation } from '../../../hooks/usePortfolio';
import { cn } from '../../../lib/utils';

const INITIAL_STATE = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company_fax_hp: '', // Honeypot spam trap
};

export function ContactForm({ className }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);
  const contactMutation = useContactMutation();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a subject';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please include a message';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Honeypot check: If filled, silently trap spam without backend dispatch
    if (formData.company_fax_hp) {
      setFormData(INITIAL_STATE);
      setIsSuccessSubmitted(true);
      toast.success('Your message has been received. Thank you for reaching out!');
      return;
    }

    // 2. Validate input fields
    if (!validate()) {
      toast.error('Please resolve the highlighted form errors.');
      return;
    }

    // 3. Dispatch to backend API
    contactMutation.mutate(
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      },
      {
        onSuccess: () => {
          setFormData(INITIAL_STATE);
          setIsSuccessSubmitted(true);
          setTimeout(() => setIsSuccessSubmitted(false), 8000);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-4', className)}>
      {/* Invisible Honeypot Spam Trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_fax_hp">Leave this field blank</label>
        <input
          id="company_fax_hp"
          type="text"
          name="company_fax_hp"
          value={formData.company_fax_hp}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Success Banner */}
      {isSuccessSubmitted && (
        <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-sm flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
          <span className="font-sans">
            Inquiry transmitted. A detailed response will be delivered within 24 business hours.
          </span>
        </div>
      )}

      {/* Name and Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="font-mono text-xs text-[#78716C]">
            FULL NAME <span className="text-[#C2410C]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            disabled={contactMutation.isPending}
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className={cn(
              'w-full h-12 px-4 rounded-xl border bg-[#FAF8F5] text-sm text-[#141416] font-sans',
              'placeholder:text-[#A8A29E] focus:bg-white focus:outline-hidden transition-all',
              errors.name
                ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                : 'border-[#E7E2DA] focus:border-[#141416]'
            )}
          />
          {errors.name && (
            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="font-mono text-xs text-[#78716C]">
            EMAIL ADDRESS <span className="text-[#C2410C]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            disabled={contactMutation.isPending}
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@organization.com"
            className={cn(
              'w-full h-12 px-4 rounded-xl border bg-[#FAF8F5] text-sm text-[#141416] font-sans',
              'placeholder:text-[#A8A29E] focus:bg-white focus:outline-hidden transition-all',
              errors.email
                ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                : 'border-[#E7E2DA] focus:border-[#141416]'
            )}
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* Subject Input */}
      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="font-mono text-xs text-[#78716C]">
          ENGAGEMENT SUBJECT <span className="text-[#C2410C]">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          disabled={contactMutation.isPending}
          value={formData.subject}
          onChange={handleChange}
          placeholder="Principal Contract / Systems Review"
          className={cn(
            'w-full h-12 px-4 rounded-xl border bg-[#FAF8F5] text-sm text-[#141416] font-sans',
            'placeholder:text-[#A8A29E] focus:bg-white focus:outline-hidden transition-all',
            errors.subject
              ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
              : 'border-[#E7E2DA] focus:border-[#141416]'
          )}
        />
        {errors.subject && (
          <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.subject}</span>
          </p>
        )}
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="contact-message" className="font-mono text-xs text-[#78716C]">
            TECHNICAL SCOPE & OBJECTIVES <span className="text-[#C2410C]">*</span>
          </label>
          <span className="text-[11px] text-[#A8A29E] font-mono">
            {formData.message.length} chars
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          disabled={contactMutation.isPending}
          value={formData.message}
          onChange={handleChange}
          placeholder="Briefly describe platform traffic, concurrency bottlenecks, tech stack, or engineering goals..."
          className={cn(
            'w-full p-4 rounded-xl border bg-[#FAF8F5] text-sm text-[#141416] font-sans',
            'placeholder:text-[#A8A29E] focus:bg-white focus:outline-hidden transition-all resize-y',
            errors.message
              ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
              : 'border-[#E7E2DA] focus:border-[#141416]'
          )}
        />
        {errors.message && (
          <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Submit Button with Tactile Ink Press */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={contactMutation.isPending}
          className={cn(
            'btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 h-12 rounded-xl',
            'bg-[#141416] text-[#FAF8F5] text-sm font-semibold tracking-tight shadow-xs',
            'hover:bg-[#2A2928] cursor-pointer',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {contactMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin-fast" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <span>Transmit Message</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}