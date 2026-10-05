import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Search, X, RefreshCw } from 'lucide-react';
import { useBlogs } from '../../hooks/usePortfolio';
import { BlogCard } from '../../components/portfolio/blogs/BlogCard';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { SkeletonLoader } from '../../components/portfolio/common/SkeletonLoader';

export function BlogArchivePage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 6;

  const { data: blogData, isLoading } = useBlogs({ page, limit });
  const blogs = blogData?.blogs || [];
  const meta = blogData?.meta || { page: 1, limit, total: 0, total_pages: 1 };

  // Filter articles based on title & excerpt
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  return (
    <div className="pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Articles & Insights' }]} />

      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Engineering Journal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] leading-tight">
          Technical Writing & Case Studies
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          In-depth architectural breakdowns, database transaction recipes, and systems design principles learned in production.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-tactile-card">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or technology..."
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0f172a] focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Article Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonLoader variant="blog" count={3} />
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-slate-200 bg-white shadow-tactile-card space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0f172a]">No articles found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}".
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {meta.total_pages > 1 && (
        <div className="pt-8 flex items-center justify-between border-t border-slate-200">
          <span className="text-xs text-slate-500 font-medium">
            Page {meta.page} of {meta.total_pages} ({meta.total} articles)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={page >= meta.total_pages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogArchivePage;