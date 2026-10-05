import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { TactileCard } from '../common/TactileCard';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogCard({ blog }) {
  if (!blog) return null;

  return (
    <TactileCard
      as="article"
      className="p-6 md:p-7 flex flex-col justify-between space-y-5 bg-white border-[#E7E2DA] hover:border-[#D6CFC4]"
    >
      <div className="space-y-4">
        {/* Cover Image Frame */}
        {blog.cover_image_url && (
          <Link
            to={`/blogs/${blog.slug}`}
            className="block overflow-hidden rounded-xl border border-[#E7E2DA] bg-[#F4EFEA] group"
          >
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              loading="lazy"
              className="w-full aspect-video object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
        )}

        {/* Metadata: Date & Estimated Reading Time in meta-mono */}
        <div className="flex items-center gap-3 text-xs text-[#78716C] font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#A8A29E]" />
            <span>{formatDate(blog.created_at)}</span>
          </span>
          <span className="text-[#E7E2DA]">•</span>
          <span className="flex items-center gap-1 text-[#78716C] bg-[#F4EFEA] px-2 py-0.5 rounded-full border border-[#E7E2DA]">
            <Clock className="h-3 w-3 text-[#A8A29E]" />
            <span>{blog.reading_time_minutes || 3} min read</span>
          </span>
        </div>

        {/* Title in Editorial Serif */}
        <h3 className="font-serif text-xl md:text-2xl font-normal text-[#141416] tracking-tight leading-snug line-clamp-2">
          <Link
            to={`/blogs/${blog.slug}`}
            className="hover:text-[#C2410C] transition-colors"
          >
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt in Graphite Ink */}
        <p className="text-sm text-[#44403C] leading-relaxed font-normal line-clamp-3 font-sans">
          {blog.excerpt}
        </p>
      </div>

      {/* Read Article Trigger */}
      <div className="pt-3 border-t border-[#E7E2DA]">
        <Link
          to={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141416] hover:text-[#C2410C] transition-colors group font-sans"
        >
          <span>Read Essay</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-[#C2410C]" />
        </Link>
      </div>
    </TactileCard>
  );
}