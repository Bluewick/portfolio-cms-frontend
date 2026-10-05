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
      className="p-6 md:p-7 flex flex-col justify-between space-y-5 hover:border-slate-300"
    >
      <div className="space-y-4">
        {/* Cover Image Frame (Aspect-Video prevents layout shift) */}
        {blog.cover_image_url && (
          <Link
            to={`/blogs/${blog.slug}`}
            className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-100 group"
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

        {/* Metadata: Date & Estimated Reading Time */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{formatDate(blog.created_at)}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 font-code text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{blog.reading_time_minutes || 3} min read</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight leading-snug line-clamp-2">
          <Link
            to={`/blogs/${blog.slug}`}
            className="hover:underline underline-offset-4 decoration-slate-300"
          >
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
          {blog.excerpt}
        </p>
      </div>

      {/* Read Article Trigger */}
      <div className="pt-3 border-t border-slate-100">
        <Link
          to={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f172a] hover:text-slate-600 transition-colors group"
        >
          <span>Read Full Article</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </TactileCard>
  );
}