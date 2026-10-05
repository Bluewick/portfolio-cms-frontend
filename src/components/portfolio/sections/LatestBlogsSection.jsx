import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useBlogs } from '../../../hooks/usePortfolio';
import { TactileCard } from '../common/TactileCard';

export function LatestBlogsSection() {
  const { data: blogData, isLoading } = useBlogs({ limit: 3 });
  const blogs = blogData?.blogs || [];

  // Ghost Section Check: Omit if empty
  if (!isLoading && blogs.length === 0) {
    return null;
  }

  return (
    <section id="writing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Technical Insights</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a]">
            Latest Engineering Articles
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl">
            In-depth breakdowns on database consistency, transaction management, and Node.js microservice architecture.
          </p>
        </div>

        {blogs.length > 0 && (
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a] hover:text-slate-600 transition-colors group self-start md:self-auto"
          >
            <span>All Articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog) => (
          <TactileCard
            key={blog.id}
            as="article"
            className="p-6 flex flex-col justify-between space-y-4 hover:border-slate-300"
          >
            <div className="space-y-3">
              {blog.cover_image_url && (
                <Link to={`/blogs/${blog.slug}`} className="block overflow-hidden rounded-xl">
                  <img
                    src={blog.cover_image_url}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full aspect-video object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              )}

              {/* Read Time & Meta */}
              <div className="flex items-center gap-2 text-xs font-code text-slate-500 font-medium">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{blog.reading_time_minutes || 3} min read</span>
              </div>

              <h3 className="font-bold text-lg text-[#0f172a] line-clamp-2 leading-snug">
                <Link
                  to={`/blogs/${blog.slug}`}
                  className="hover:underline underline-offset-4 decoration-slate-300"
                >
                  {blog.title}
                </Link>
              </h3>

              <p className="text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={`/blogs/${blog.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f172a] group"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </TactileCard>
        ))}
      </div>
    </section>
  );
}