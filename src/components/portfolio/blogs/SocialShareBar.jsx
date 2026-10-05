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
      <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] mr-1 flex items-center gap-1">
        <Share2 className="h-3 w-3" />
        <span>Share:</span>
      </span>

      <button
        type="button"
        onClick={handleTwitterShare}
        aria-label="Share on X (Twitter)"
        className="btn-press inline-flex items-center justify-center h-8 w-8 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] hover:text-[#141416] hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs"
      >
        <FaXTwitter className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
        className="btn-press inline-flex items-center justify-center h-8 w-8 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] hover:text-[#141416] hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs"
      >
        <FaLinkedinIn className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy article link"
        className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] hover:text-[#141416] hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all text-xs font-medium cursor-pointer shadow-2xs font-mono"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#16A34A]" />
            <span className="text-[#16A34A] font-semibold">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-[#A8A29E]" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}