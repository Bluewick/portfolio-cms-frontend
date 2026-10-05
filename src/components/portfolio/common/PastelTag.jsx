import React from 'react';
import { 
  Code2, 
  Database, 
  Cloud, 
  Cpu, 
  Layers, 
  Sparkles, 
  Terminal, 
  Globe 
} from 'lucide-react';
import { cn } from '../../../lib/utils';

/**
 * Category color mappings defined in DESIGN.md
 */
const CATEGORY_STYLES = {
  frontend: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#DBEAFE]',
    defaultIcon: Globe,
  },
  backend: {
    bg: 'bg-[#F4EFEA]',
    text: 'text-[#44403C]',
    border: 'border-[#E7E2DA]',
    defaultIcon: Terminal,
  },
  database: {
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#C2410C]',
    border: 'border-[#FED7AA]',
    defaultIcon: Database,
  },
  architecture: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#6D28D9]',
    border: 'border-[#EDE9FE]',
    defaultIcon: Cloud,
  },
  cloud: {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#6D28D9]',
    border: 'border-[#EDE9FE]',
    defaultIcon: Cloud,
  },
  fullstack: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    defaultIcon: Layers,
  },
  specialized: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    border: 'border-[#FDE68A]',
    defaultIcon: Cpu,
  },
  experimental: {
    bg: 'bg-[#FFF1F2]',
    text: 'text-[#BE123C]',
    border: 'border-[#FECDD3]',
    defaultIcon: Sparkles,
  },
  neutral: {
    bg: 'bg-[#F4EFEA]',
    text: 'text-[#44403C]',
    border: 'border-[#E7E2DA]',
    defaultIcon: Code2,
  },
};

/**
 * Normalizes category strings from CMS/API
 */
function resolveCategory(category = '') {
  const normalized = category.toLowerCase().trim();
  if (normalized.includes('front') || normalized.includes('web') || normalized.includes('react')) return 'frontend';
  if (normalized.includes('back') || normalized.includes('api') || normalized.includes('node')) return 'backend';
  if (normalized.includes('data') || normalized.includes('sql') || normalized.includes('postgres')) return 'database';
  if (normalized.includes('cloud') || normalized.includes('devops') || normalized.includes('architect') || normalized.includes('aws')) return 'architecture';
  if (normalized.includes('full') || normalized.includes('mobile')) return 'fullstack';
  if (normalized.includes('experim') || normalized.includes('rust') || normalized.includes('r&d')) return 'experimental';
  return 'neutral';
}

export function PastelTag({
  name,
  category = 'neutral',
  iconUrl,
  icon: CustomIcon,
  size = 'md',
  className,
}) {
  const categoryKey = resolveCategory(category);
  const style = CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.neutral;
  const FallbackIcon = style.defaultIcon;

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        style.bg,
        style.text,
        style.border,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {/* Leading Icon (SVG / Image / Fallback) */}
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          aria-hidden="true"
          className="w-3.5 h-3.5 object-contain shrink-0"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : CustomIcon ? (
        <CustomIcon className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" aria-hidden="true" />
      ) : (
        <FallbackIcon className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" aria-hidden="true" />
      )}
      <span className="leading-none whitespace-nowrap">{name}</span>
    </span>
  );
}