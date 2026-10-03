import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, User, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { Spinner } from '../../components/ui/Spinner';

export function AboutPage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar_url: '',
    resume_url: '',
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
    },
  });

  // Query profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['about-profile'],
    queryFn: async () => {
      const res = await api.get('/api/about');
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        title: profileData.title || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || '',
        resume_url: profileData.resume_url || '',
        social_links: {
          github: profileData.social_links?.github || '',
          linkedin: profileData.social_links?.linkedin || '',
          twitter: profileData.social_links?.twitter || '',
        },
      });
    }
  }, [profileData]);

  // Mutation to update profile
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put('/api/admin/about', payload);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'About profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['about-profile'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update profile settings.'));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Full Name is required');
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size="lg" className="text-[#2563eb]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Loading profile settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Profile & Bio Settings</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Configure your public identity, bio summary, avatar, and career links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Preview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Profile Avatar
              </h3>
              <MediaUploader
                value={formData.avatar_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
                label=""
                description="Upload square portrait (WebP, PNG, or JPEG)"
              />
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Curriculum Vitae / Resume
              </h3>
              <Input
                label="Public Resume Link"
                type="url"
                placeholder="https://example.com/resume.pdf"
                value={formData.resume_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, resume_url: e.target.value }))
                }
                leftIcon={<FileText className="w-4 h-4" />}
                helperText="Link to your hosted PDF resume or document"
              />
            </div>
          </div>

          {/* Right Column: Bio & Core Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-[#f1f5f9] pb-3">
                General Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  leftIcon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Professional Title"
                  required
                  placeholder="e.g. Principal Systems Architect"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <Textarea
                label="Professional Biography"
                rows={5}
                required
                placeholder="Write a concise overview of your background, architectural focus, and engineering values..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                helperText="Displayed in the header and about section of the live portfolio"
              />
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-level-1 space-y-4">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-[#f1f5f9] pb-3">
                Social Accounts & Networks
              </h3>

              <div className="space-y-3">
                <Input
                  label="GitHub Profile URL"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.social_links.github}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, github: e.target.value },
                    }))
                  }
                  leftIcon={<FaGithub className="w-4 h-4" />}
                />

                <Input
                  label="LinkedIn Profile URL"
                  type="url"
                  placeholder="https://linkedin.com/in/yourusername"
                  value={formData.social_links.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: e.target.value },
                    }))
                  }
                  leftIcon={<FaLinkedin className="w-4 h-4" />}
                />

                <Input
                  label="Twitter / X Profile URL"
                  type="url"
                  placeholder="https://twitter.com/yourusername"
                  value={formData.social_links.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: e.target.value },
                    }))
                  }
                  leftIcon={<FaXTwitter className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={mutation.isPending}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}