import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Globe,  Plus, Trash2, Star, AlertCircle } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { SkillPicker } from '../../components/shared/SkillPicker';
import { Spinner } from '../../components/ui/Spinner';

export function ProjectEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnail_url: '',
    live_url: '',
    github_url: '',
    is_featured: false,
    display_order: 1,
    links: [],
    skill_ids: [],
  });

  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);

  // Load existing project if editing
  const { data: projectData, isLoading } = useQuery({
    queryKey: ['projects', 'admin', id],
    queryFn: async () => {
      const res = await api.get(`/api/admin/projects/${id}`);
      return res.data?.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (projectData) {
      setFormData({
        title: projectData.title || '',
        slug: projectData.slug || '',
        summary: projectData.summary || '',
        content: projectData.content || '',
        thumbnail_url: projectData.thumbnail_url || '',
        live_url: projectData.live_url || '',
        github_url: projectData.github_url || '',
        is_featured: projectData.is_featured || false,
        display_order: projectData.display_order || 1,
        links: projectData.links || [],
        skill_ids: projectData.skills ? projectData.skills.map((s) => s.id) : [],
      });
      setHasManuallyEditedSlug(true);
    }
  }, [projectData]);

  // Title -> Slug auto-generator
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

  // Dynamic links handlers
  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { label: '', url: '', icon_url: '' },
      ],
    }));
  };

  const handleUpdateLink = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.links];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, links: updated };
    });
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async ({ payload, status }) => {
      const submission = { ...payload, status };
      if (isEditing) {
        return api.put(`/api/admin/projects/${id}`, submission);
      }
      return api.post('/api/admin/projects', submission);
    },
    onSuccess: (_, variables) => {
      const statusText = variables.status === 'published' ? 'published' : 'saved as draft';
      toast.success(`Project ${statusText} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['projects', 'admin'] });
      navigate('/admin/projects');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save project.'));
    },
  });

  const handleSubmit = (status) => {
    if (!formData.title.trim()) {
      toast.error('Project title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Project slug identifier is required.');
      return;
    }
    saveMutation.mutate({ payload: formData, status });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" className="text-[#2563eb]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Loading project data...
        </span>
      </div>
    );
  }

  const isAlreadyPublished = projectData?.status === 'published';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">
              {isEditing ? `Edit: ${formData.title || 'Project'}` : 'Create New Project'}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Fill in architecture details, repository links, and tech stack tags.
            </p>
          </div>
        </div>

        {/* Dual Draft vs Publish Triggers */}
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
            {isAlreadyPublished ? 'Update Published' : 'Publish Project'}
          </Button>
        </div>
      </div>

      {/* Live Sync Notice */}
      {isAlreadyPublished && (
        <div className="p-3.5 bg-[#eff6ff] border border-[#dbeafe] rounded-xl flex items-center gap-2.5 text-xs text-[#1d4ed8]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            This project is currently live on your public site. Any submitted changes will update in production.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                required
                placeholder="e.g. INTELLICODE AI"
                value={formData.title}
                onChange={handleTitleChange}
              />

              <Input
                label="Slug Identifier"
                required
                placeholder="e.g. intellicode-ai"
                value={formData.slug}
                onChange={(e) => {
                  setHasManuallyEditedSlug(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                helperText="URL path: /projects/<slug>"
              />
            </div>

            <Textarea
              label="Summary Description"
              rows={3}
              placeholder="High-level value proposition and system summary..."
              value={formData.summary}
              onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            />

            <Textarea
              label="Detailed Content / Architecture Write-up (Markdown/HTML)"
              rows={10}
              placeholder="# System Architecture&#10;&#10;Explain data flow, database queries, and benchmarks..."
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>

          {/* Relational Skills Junction */}
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1">
            <SkillPicker
              selectedSkillIds={formData.skill_ids}
              onChange={(ids) => setFormData((prev) => ({ ...prev, skill_ids: ids }))}
            />
          </div>

          {/* Dynamic External Links Repeater */}
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                External Repositories & Resource Links
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Link
              </Button>
            </div>

            {formData.links.length === 0 ? (
              <p className="text-xs text-[#94a3b8] italic">
                No extra repository links added yet (e.g. Frontend repo, Backend API, Documentation).
              </p>
            ) : (
              <div className="space-y-3">
                {formData.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex items-center gap-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                      <input
                        type="text"
                        placeholder="Label (e.g. Frontend React)"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                        className="h-8 px-2.5 text-xs bg-white rounded border border-[#e2e8f0] outline-none"
                      />
                      <input
                        type="url"
                        placeholder="URL (https://github.com/...)"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                        className="h-8 px-2.5 text-xs bg-white rounded border border-[#e2e8f0] outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Icon URL (optional SVG)"
                        value={link.icon_url || ''}
                        onChange={(e) => handleUpdateLink(idx, 'icon_url', e.target.value)}
                        className="h-8 px-2.5 text-xs bg-white rounded border border-[#e2e8f0] outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider block">
              Project Thumbnail
            </span>
            <MediaUploader
              value={formData.thumbnail_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
              label=""
              description="Upload project banner (WebP, PNG, or JPEG)"
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
            <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider block border-b border-[#f1f5f9] pb-3">
              Core URLs & Highlights
            </span>

            <Input
              label="Live Production URL"
              type="url"
              placeholder="https://app.example.com"
              value={formData.live_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, live_url: e.target.value }))}
              leftIcon={<Globe className="w-4 h-4" />}
            />

            <Input
              label="GitHub Repository"
              type="url"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
              leftIcon={<FaGithub className="w-4 h-4" />}
            />

            <div className="pt-2 border-t border-[#f1f5f9]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-[#2563eb] border-[#e2e8f0] focus:ring-[#2563eb]"
                />
                <span className="text-xs font-semibold text-[#0f172a] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-current" />
                  Mark as Featured Project
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}