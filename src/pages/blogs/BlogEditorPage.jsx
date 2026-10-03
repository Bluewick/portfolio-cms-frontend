import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { RichTextEditor } from '../../components/shared/RichTextEditor';
import { MarkdownPreview } from '../../components/shared/MarkdownPreview';
import { Spinner } from '../../components/ui/Spinner';

export function BlogEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
  });

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blogs', 'admin', id],
    queryFn: async () => {
      const res = await api.get(`/api/admin/blogs/${id}`);
      return res.data?.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || '',
        slug: blogData.slug || '',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        cover_image_url: blogData.cover_image_url || '',
      });
      setHasManuallyEditedSlug(true);
    }
  }, [blogData]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: hasManuallyEditedSlug
        ? prev.slug
        : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    }));
  };

  // Estimate reading time in minutes
  const wordCount = formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  const saveMutation = useMutation({
    mutationFn: async ({ payload, status }) => {
      const submission = { ...payload, status };
      if (isEditing) {
        return api.put(`/api/admin/blogs/${id}`, submission);
      }
      return api.post('/api/admin/blogs', submission);
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status === 'published' ? 'published' : 'saved as draft';
      toast.success(`Blog article ${statusText} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['blogs', 'admin'] });
      navigate('/admin/blogs');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save blog post.'));
    },
  });

  const handleSubmit = (status) => {
    if (!formData.title.trim()) {
      toast.error('Article title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Article slug identifier is required.');
      return;
    }
    saveMutation.mutate({ payload: formData, status });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" className="text-[#2563eb]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Loading article data...
        </span>
      </div>
    );
  }

  const isAlreadyPublished = blogData?.status === 'published';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs"
            className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">
              {isEditing ? `Edit: ${formData.title || 'Post'}` : 'Write New Article'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#475569]">
              <span className="flex items-center gap-1 text-[#2563eb] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                ~{estimatedReadingTime} min read
              </span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={saveMutation.isPending}
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={saveMutation.isPending}
            onClick={() => handleSubmit('published')}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isAlreadyPublished ? 'Update Published' : 'Publish Article'}
          </Button>
        </div>
      </div>

      {isAlreadyPublished && (
        <div className="p-3.5 bg-[#eff6ff] border border-[#dbeafe] rounded-xl flex items-center gap-2.5 text-xs text-[#1d4ed8]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            This post is currently live on your blog. Any edits will immediately reflect publicly.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Main Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Article Title"
                required
                placeholder="e.g. Mastering PostgreSQL Transactions in Node.js"
                value={formData.title}
                onChange={handleTitleChange}
              />

              <Input
                label="Slug Identifier"
                required
                placeholder="e.g. mastering-postgresql-transactions"
                value={formData.slug}
                onChange={(e) => {
                  setHasManuallyEditedSlug(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
              />
            </div>

            <Textarea
              label="Excerpt Summary"
              rows={3}
              placeholder="A brief summary for previews and social sharing..."
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            />
          </div>

          {/* WYSIWYG Write vs Preview Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Article Body
              </span>

              <div className="inline-flex items-center p-1 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`h-7 px-3 text-xs rounded-md font-semibold transition-all ${
                    activeTab === 'write'
                      ? 'bg-white text-[#0f172a] shadow-level-1'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`h-7 px-3 text-xs rounded-md font-semibold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-white text-[#0f172a] shadow-level-1'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Sanitized Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              />
            ) : (
              <MarkdownPreview content={formData.content} />
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider block">
              Cover Image Asset
            </span>
            <MediaUploader
              value={formData.cover_image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, cover_image_url: url }))}
              label=""
              description="Upload post cover banner (WebP, JPEG, PNG)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}