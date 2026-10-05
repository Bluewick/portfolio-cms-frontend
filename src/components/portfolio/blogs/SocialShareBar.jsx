import React, { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { toast } from 'sonner';

export function SocialShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Article URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title || 'Engineering Article'
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
        <Share2 className="h-3 w-3" />
        <span>Share:</span>
      </span>

      <button
        type="button"
        onClick={handleTwitterShare}
        aria-label="Share on X (Twitter)"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
      >
        <FaXTwitter className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
        className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
      >
        <FaLinkedinIn className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy article link"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium cursor-pointer shadow-2xs"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-600 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}