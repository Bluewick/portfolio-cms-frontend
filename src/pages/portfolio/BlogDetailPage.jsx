import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { useBlogDetails, useBlogs, useAbout } from '../../hooks/usePortfolio';
import { Breadcrumb } from '../../components/portfolio/common/Breadcrumb';
import { TactileCard } from '../../components/portfolio/common/TactileCard';
import { SkeletonLoader } from '../../components/portfolio/common/SkeletonLoader';
import { SocialShareBar } from '../../components/portfolio/blogs/SocialShareBar';
import { sanitizeHtml } from '../../lib/sanitize';
import { highlightAll } from '../../lib/prism';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useBlogDetails(slug);
  const { data: blogData } = useBlogs({ limit: 10 });
  const { data: about } = useAbout();

  const allBlogs = blogData?.blogs || [];

  // Syntax highlighting and copy button injection for rich-text code blocks
  useEffect(() => {
    if (blog?.content) {
      highlightAll();

      // Enhance all <pre> elements with dynamic copy buttons
      const preElements = document.querySelectorAll('article pre');
      preElements.forEach((pre) => {
        if (pre.querySelector('.copy-code-trigger')) return;

        pre.classList.add('relative', 'group');
        const copyBtn = document.createElement('button');
        copyBtn.className =
          'copy-code-trigger absolute top-3 right-3 text-[11px] font-sans font-medium px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 opacity-0 group-hover:opacity-100 hover:bg-slate-700 hover:text-white transition-all cursor-pointer';
        copyBtn.innerText = 'Copy';

        copyBtn.onclick = async () => {
          const codeText = pre.querySelector('code')?.innerText || pre.innerText;
          try {
            await navigator.clipboard.writeText(codeText);
            toast.success('Code copied to clipboard');
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
              copyBtn.innerText = 'Copy';
            }, 2000);
          } catch {
            toast.error('Failed to copy code');
          }
        };

        pre.appendChild(copyBtn);
      });
    }
  }, [blog?.content]);

  // 404 / Draft State Fallback
  if (error || (!isLoading && !blog)) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-3xl mx-auto text-center space-y-6">
        <Breadcrumb items={[{ label: 'Articles', href: '/blogs' }, { label: 'Not Found' }]} />
        <TactileCard className="p-10 md:p-14 space-y-5">
          <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
            Article Not Found
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The article "{slug}" does not exist, has been drafted, or has been moved to an alternative URL.
          </p>
          <div className="pt-2">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition-all shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </TactileCard>
      </div>
    );
  }

  // Loading State (Zero CLS)
  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-8">
        <SkeletonLoader variant="text" count={2} />
        <div className="aspect-video w-full rounded-2xl bg-slate-100 animate-pulse" />
        <SkeletonLoader variant="text" count={6} />
      </div>
    );
  }

  // Calculate Previous and Next articles for continuous reading
  const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex >= 0 && currentIndex < allBlogs.length - 1
      ? allBlogs[currentIndex + 1]
      : null;

  const sanitizedContent = sanitizeHtml(blog.content);

  return (
    <article className="pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-10">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Technical Essays', href: '/blogs' },
          { label: blog.title },
        ]}
      />

      {/* 2. Article Header */}
      <header className="space-y-6">
        {/* Meta badges in meta-mono */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C] font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#A8A29E]" />
            <span>{formatDate(blog.created_at)}</span>
          </span>

          <span className="text-[#E7E2DA]">•</span>

          <span className="flex items-center gap-1 text-[#78716C] bg-[#F4EFEA] px-2.5 py-0.5 rounded-full border border-[#E7E2DA]">
            <Clock className="h-3 w-3 text-[#A8A29E]" />
            <span>{blog.reading_time_minutes || 3} min read</span>
          </span>
        </div>

        {/* Display Title in Editorial Serif */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-[#141416] leading-[1.12]">
          {blog.title}
        </h1>

        {/* Excerpt Lead */}
        {blog.excerpt && (
          <p className="text-lg text-[#44403C] leading-relaxed font-normal font-sans">
            {blog.excerpt}
          </p>
        )}

        {/* Author Byline & Social Share Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-6 border-y border-[#E7E2DA]">
          <div className="flex items-center gap-3">
            {about?.avatar_url ? (
              <img
                src={about.avatar_url}
                alt={about.name}
                className="h-10 w-10 rounded-full object-cover border border-[#E7E2DA] aspect-square"
                loading="lazy"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#141416] text-[#FAF8F5] font-serif flex items-center justify-center font-bold text-xs">
                {about?.name ? about.name[0] : 'A'}
              </div>
            )}
            <div>
              <p className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider">
                // AUTHOR BYLINE
              </p>
              <p className="font-serif font-bold text-sm text-[#141416]">
                {about?.name || 'Alex Mercer'}
              </p>
            </div>
          </div>

          <SocialShareBar title={blog.title} />
        </div>
      </header>

      {/* 3. Cover Hero Image Framed with Hairline Border */}
      {blog.cover_image_url && (
        <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E2DA] bg-[#F4EFEA] shadow-xs">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* 4. Sanitized Rich Text Prose Content constrained to 65ch for Ergonomics */}
      <div className="editorial-prose paper-code-inspector prose prose-stone max-w-[65ch] mx-auto prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#141416] prose-h1:text-3xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl prose-p:text-[#44403C] prose-p:leading-[1.75] prose-p:font-sans prose-li:text-[#44403C] prose-strong:text-[#141416] prose-blockquote:border-l-2 prose-blockquote:border-[#C2410C] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-[#141416] prose-code:font-mono prose-pre:p-0 prose-pre:border-none prose-pre:bg-transparent">
        {sanitizedContent ? (
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        ) : (
          <p className="text-[#78716C] italic font-serif">Article content in preparation.</p>
        )}
      </div>

      {/* 5. Author Bio Card Callout */}
      <TactileCard className="p-6 md:p-8 bg-[#F4EFEA] border-[#E7E2DA] space-y-3">
        <h2 className="font-mono text-xs font-semibold text-[#141416] uppercase tracking-wider">
          // About the Author
        </h2>
        <p className="text-sm text-[#44403C] leading-relaxed font-normal font-sans">
          <strong className="text-[#141416]">{about?.name || 'Alex Mercer'}</strong> is a{' '}
          {about?.title || 'Principal Backend & Systems Architect'}.{' '}
          {about?.bio ||
            'Passionate about distributed databases, event-driven architectures, and high-concurrency Node.js microservices.'}
        </p>
      </TactileCard>

      {/* 6. Previous & Next Article Navigation */}
      <div className="pt-10 mt-14 border-t border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevBlog ? (
          <Link
            to={`/blogs/${prevBlog.slug}`}
            className="p-5 rounded-2xl border border-[#E7E2DA] bg-white hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all group flex flex-col justify-between space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-mono">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              <span>// PREVIOUS ESSAY</span>
            </div>
            <span className="font-serif text-base text-[#141416] line-clamp-1 group-hover:text-[#C2410C]">
              {prevBlog.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextBlog && (
          <Link
            to={`/blogs/${nextBlog.slug}`}
            className="p-5 rounded-2xl border border-[#E7E2DA] bg-white hover:border-[#D6CFC4] hover:bg-[#FAF8F5] transition-all group flex flex-col justify-between space-y-2 text-right shadow-xs"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-[#78716C] font-mono">
              <span>// NEXT ESSAY</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-serif text-base text-[#141416] line-clamp-1 group-hover:text-[#C2410C]">
              {nextBlog.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default BlogDetailPage;