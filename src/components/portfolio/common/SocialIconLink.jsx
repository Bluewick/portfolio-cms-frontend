import React from 'react';
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaXTwitter, 
  FaGlobe, 
  FaEnvelope 
} from 'react-icons/fa6';
import { cn } from '../../../lib/utils';

export function SocialIconLink({
  type = 'github',
  url,
  label,
  showLabel = false,
  className,
}) {
  if (!url) return null;

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'github':
        return <FaGithub className="h-4 w-4" />;
      case 'linkedin':
        return <FaLinkedinIn className="h-4 w-4" />;
      case 'twitter':
      case 'x':
        return <FaXTwitter className="h-3.5 w-3.5" />;
      case 'email':
      case 'mail':
        return <FaEnvelope className="h-3.5 w-3.5" />;
      default:
        return <FaGlobe className="h-3.5 w-3.5" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || type}
      className={cn(
        'btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E2DA] bg-white text-[#44403C] shadow-2xs transition-all duration-150',
        'hover:border-[#D6CFC4] hover:bg-[#FAF8F5] hover:text-[#141416]',
        showLabel ? 'px-3.5 py-1.5 text-xs font-mono font-medium' : 'h-9 w-9 shrink-0',
        className
      )}
    >
      {getIcon()}
      {showLabel && <span>{label || type}</span>}
    </a>
  );
}