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
      <Breadcrumb items={[{ label: 'Technical Essays' }]} />

      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
          // ARCHIVE ARTICLES & TECHNICAL MONOGRAPHS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#141416] leading-[1.1]">
          Technical Essays & <em className="italic font-serif text-[#C2410C]">Monographs</em>
        </h1>
        <p className="text-base text-[#44403C] leading-relaxed font-normal font-sans">
          In-depth architectural breakdowns, database transaction recipes, distributed concurrency patterns, and lessons learned running production backends.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white border border-[#E7E2DA] shadow-[0_1px_3px_rgba(20,20,22,0.03)]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or technology..."
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E7E2DA] bg-[#FAF8F5] text-sm text-[#141416] placeholder:text-[#A8A29E] focus:bg-white focus:border-[#141416] focus:outline-hidden transition-colors font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#141416] p-1 cursor-pointer"
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
        <div className="text-center py-16 px-4 rounded-3xl border border-[#E7E2DA] bg-white shadow-[0_1px_3px_rgba(20,20,22,0.03)] space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto text-[#78716C]">
            <Search className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-normal text-[#141416]">No essays located</h3>
            <p className="text-sm text-[#78716C] max-w-sm mx-auto font-sans">
              No entries matched "{searchQuery}". Try a different keyword or reset search.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="btn-press inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2A2928] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {meta.total_pages > 1 && (
        <div className="pt-8 flex items-center justify-between border-t border-[#E7E2DA]">
          <span className="font-mono text-xs text-[#78716C]">
            Page {meta.page} of {meta.total_pages} ({meta.total} essays)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="btn-press inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#E7E2DA] bg-white text-xs font-medium text-[#44403C] hover:border-[#D6CFC4] hover:text-[#141416] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs font-mono"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={page >= meta.total_pages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-press inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#E7E2DA] bg-white text-xs font-medium text-[#44403C] hover:border-[#D6CFC4] hover:text-[#141416] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs font-mono"
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