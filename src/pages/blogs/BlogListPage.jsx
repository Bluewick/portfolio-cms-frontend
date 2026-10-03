import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

export function BlogListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ['blogs', 'admin', page],
    queryFn: async () => {
      const res = await api.get(`/api/admin/blogs?page=${page}&limit=10`);
      return res.data;
    },
  });

  const blogs = blogResponse?.data || [];
  const meta = blogResponse?.meta || { page: 1, limit: 10, total: 0, total_pages: 1 };

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/api/admin/blogs/${id}`),
    onSuccess: () => {
      toast.success('Blog post deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['blogs', 'admin'] });
      setBlogToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete blog post.'));
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Blog Engine</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Write, publish, and manage architectural essays and engineering guides.
          </p>
        </div>

        <Link to="/admin/blogs/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Write Article
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading blog articles...
          </span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <BookOpen className="w-8 h-8 text-[#94a3b8] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#0f172a]">No Blog Articles Yet</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Share engineering insights, post-mortems, and technical deep-dives.
          </p>
          <Link to="/admin/blogs/new" className="inline-block mt-4">
            <Button variant="outline" size="sm">
              Write First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 overflow-hidden">
          <div className="divide-y divide-[#f1f5f9]">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
                    {blog.cover_image_url ? (
                      <img
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <BookOpen className="w-5 h-5 text-[#94a3b8]" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#0f172a] truncate">
                        {blog.title}
                      </h3>
                      <Badge
                        variant={blog.status === 'published' ? 'success' : 'warning'}
                        size="sm"
                        dot
                      >
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#475569] truncate max-w-lg">
                      {blog.excerpt || 'No excerpt summary.'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.reading_time_minutes || 1} min read
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#94a3b8] hover:text-[#2563eb] rounded-lg transition-colors"
                    title="View OpenGraph / Public Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                    className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                    title="Edit Blog"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlogToDelete(blog)}
                    className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {meta.total_pages > 1 && (
            <div className="p-3.5 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
              <span>
                Page {meta.page} of {meta.total_pages} ({meta.total} total posts)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(blogToDelete)}
        title={`Delete ${blogToDelete?.title}?`}
        message="This action permanently deletes this blog post from your portfolio."
        isLoading={deleteMutation?.isPending}
        onConfirm={() => deleteMutation?.mutate(blogToDelete?.id)}
        onClose={() => setBlogToDelete(null)}
      />
    </div>
  );
}