import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useBlogs } from '../../../hooks/usePortfolio';
import { TactileCard } from '../common/TactileCard';
import { BlogCard } from '../blogs/BlogCard';

export function LatestBlogsSection() {
  const { data: blogData, isLoading } = useBlogs({ limit: 3 });
  const blogs = blogData?.blogs || [];

  // Ghost Section Check: Omit if empty
  if (!isLoading && blogs.length === 0) {
    return null;
  }

  return (
    <section id="writing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E7E2DA] pb-8">
        <div className="space-y-3">
          <div className="font-mono text-xs font-semibold tracking-wider text-[#78716C] uppercase">
            // 06. WRITTEN ESSAYS & MONOGRAPHS
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-[#141416]">
            Technical writing on <em className="italic font-serif text-[#C2410C]">systems design</em>.
          </h2>
          <p className="text-sm md:text-base text-[#44403C] max-w-xl font-sans">
            In-depth breakdowns on database consistency, transaction management, and Node.js microservice architecture.
          </p>
        </div>

        {blogs.length > 0 && (
          <Link
            to="/blogs"
            className="btn-press inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-[#141416] hover:text-[#C2410C] transition-colors group self-start md:self-auto"
          >
            <span>All Essays ({blogData?.meta?.total || blogs.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}