import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  AlertCircle, 
  Settings2, 
  Columns, 
  Code2, 
  Eye, 
  FileCode2,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { CodeEditor } from '../../components/admin/blogs/CodeEditor';
import { EditorPreview } from '../../components/admin/blogs/EditorPreview';
import { Spinner } from '../../components/ui/Spinner';

export function BlogEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Layout View Modes: 'split' (side-by-side) | 'edit' (focus code) | 'preview' (full reading preview)
  const [viewMode, setViewMode] = useState('split');

  // Format Selection: 'html' | 'markdown'
  const [contentType, setContentType] = useState('html');

  // Collapsible Settings Drawer
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      // If content was saved in markdown, preserve preference
      if (blogData.content_type) {
        setContentType(blogData.content_type);
      }
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

  // Word count & reading time
  const wordCount = formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  const saveMutation = useMutation({
    mutationFn: async ({ payload, status }) => {
      const submission = { ...payload, status, content_type: contentType };
      if (isEditing) {
        return api.put(`/api/admin/blogs/${id}`, submission);
      }
      return api.post('/api/admin/blogs', submission);
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status === 'published' ? 'published' : 'saved as draft';
      toast.success(`Article ${statusText} successfully.`);
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
      setIsSettingsOpen(true);
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Article slug is required.');
      setIsSettingsOpen(true);
      return;
    }
    saveMutation.mutate({ payload: formData, status });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" className="text-[#2563eb]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Loading article data...
        </span>
      </div>
    );
  }

  const isAlreadyPublished = blogData?.status === 'published';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#FAF8F5]">
      {/* 1. Global Editor Header (Clean & Uncluttered) */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-[#E7E2DA] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/blogs"
            className="p-2 text-[#78716C] hover:text-[#141416] hover:bg-[#F4EFEA] rounded-lg transition-colors"
            title="Back to all articles"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-sm font-bold text-[#141416] line-clamp-1 max-w-[200px] sm:max-w-xs">
              {formData.title || 'Untitled Essay'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-[#78716C] font-mono">
              <span className="flex items-center gap-1 text-[#C2410C]">
                <Clock className="w-3 h-3" />
                {estimatedReadingTime} min read
              </span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Center Controls: Format Chooser & Viewport Toggles */}
        <div className="hidden md:flex items-center gap-3">
          {/* Format Chooser (HTML vs Markdown) */}
          <div className="inline-flex items-center p-1 bg-[#F4EFEA] rounded-lg border border-[#E7E2DA] text-xs font-mono">
            <button
              type="button"
              onClick={() => setContentType('html')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                contentType === 'html'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setContentType('markdown')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                contentType === 'markdown'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              }`}
            >
              MARKDOWN
            </button>
          </div>

          {/* View Mode Toggle: Split / Edit / Preview */}
          <div className="inline-flex items-center p-1 bg-[#F4EFEA] rounded-lg border border-[#E7E2DA] gap-1">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#78716C] hover:text-[#141416]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Settings Drawer Toggle & Save Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-lg border transition-all ${
              isSettingsOpen
                ? 'bg-[#141416] text-white border-[#141416]'
                : 'bg-white text-[#78716C] border-[#E7E2DA] hover:text-[#141416]'
            }`}
            title="Post Settings (Slug, Excerpt, Cover)"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() => handleSubmit('draft')}
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={saveMutation.isPending}
            onClick={() => handleSubmit('published')}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isAlreadyPublished ? 'Update' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* 2. Main Workspace Canvas (Split / Edit / Preview) */}
      <main className="flex-1 relative flex overflow-hidden p-4 sm:p-6 gap-4">
        {/* Left Side: Code Editor */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`h-full ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
            <CodeEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              contentType={contentType}
            />
          </div>
        )}

        {/* Right Side: Live Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`h-full ${viewMode === 'split' ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
            <EditorPreview
              content={formData.content}
              title={formData.title}
              contentType={contentType}
            />
          </div>
        )}

        {/* 3. Collapsible Post Settings Drawer (Slide-Over from Right) */}
        {isSettingsOpen && (
          <aside className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white border-l border-[#E7E2DA] shadow-xl z-30 flex flex-col p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E2DA]">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#C2410C]" />
                <h3 className="font-serif font-bold text-base text-[#141416]">
                  Post Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-md text-[#78716C] hover:text-[#141416] hover:bg-[#F4EFEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-semibold">
                Article Title *
              </label>
              <Input
                placeholder="e.g. Why I Separate Controllers in Express"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-semibold">
                Slug URL identifier *
              </label>
              <Input
                placeholder="why-i-separate-controllers"
                value={formData.slug}
                onChange={(e) => {
                  setHasManuallyEditedSlug(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
              />
              <span className="text-[10px] text-[#A8A29E] font-mono block">
                /blogs/{formData.slug || 'your-slug'}
              </span>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-semibold">
                Excerpt Lead
              </label>
              <Textarea
                rows={4}
                placeholder="Summary for previews and SEO..."
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#78716C] font-semibold">
                Hero Cover Banner
              </label>
              <MediaUploader
                value={formData.cover_image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, cover_image_url: url }))}
                label=""
                description="Upload post cover banner (WebP, JPEG, PNG)"
              />
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}