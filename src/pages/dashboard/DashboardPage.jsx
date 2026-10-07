import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FolderGit2,
  BookOpen,
  Mail,
  Cpu,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export function DashboardPage() {
  // 1. Health Query
  const { data: healthData, isError: isHealthError } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/api/health');
      return res.data;
    },
    refetchInterval: 60000,
  });

  // 2. Projects Query
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/projects');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  // 3. Blogs Query
  const { data: blogResponse, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['blogs', 'admin', 1],
    queryFn: async () => {
      const res = await api.get('/api/admin/blogs?page=1&limit=5');
      return res.data;
    },
  });

  // 4. Contact Inquiries Query
  const { data: contactResponse, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['contacts', 'admin', 1],
    queryFn: async () => {
      const res = await api.get('/api/admin/contact?page=1&limit=5');
      return res.data;
    },
  });

  // 5. Skills Query
  const { data: skills = [] } = useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/skills');
      return res.data?.data || [];
    },
  });

  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;

  const totalBlogs = blogResponse?.meta?.total || 0;
  const blogs = blogResponse?.data || [];
  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;

  const totalContacts = contactResponse?.meta?.total || 0;
  const contacts = contactResponse?.data || [];
  const unreadContacts = contacts.filter((c) => !c.is_read).length;

  const isSystemHealthy = !isHealthError;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">
            CMS Control Center
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Operational status, portfolio metrics, and rapid publishing shortcuts.
          </p>
        </div>

        {/* Backend System Health Pill */}
        {/* <div className="flex items-center gap-2">
          {isSystemHealthy ? (
            <Badge variant="success" size="md" dot>
              API Services Operational
            </Badge>
          ) : (
            <Badge variant="error" size="md" dot>
              API Services Degraded
            </Badge>
          )}
        </div> */}
      </div>

      {/* KPI Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Portfolio Projects"
          value={isLoadingProjects ? <Spinner size="sm" /> : projects.length}
          subtitle={`${publishedProjects} published • ${draftProjects} drafts`}
          icon={FolderGit2}
          badgeText="Active"
          badgeVariant="primary"
        />

        <StatCard
          title="Blog Articles"
          value={isLoadingBlogs ? <Spinner size="sm" /> : totalBlogs}
          subtitle="Editorial essays"
          icon={BookOpen}
          badgeText="Published"
          badgeVariant="success"
        />

        <StatCard
          title="Inquiries"
          value={isLoadingContacts ? <Spinner size="sm" /> : totalContacts}
          subtitle={`${unreadContacts} awaiting review`}
          icon={Mail}
          badgeText={unreadContacts > 0 ? `${unreadContacts} Unread` : 'Inbox Clean'}
          badgeVariant={unreadContacts > 0 ? 'warning' : 'neutral'}
        />

        <StatCard
          title="Technology Stack"
          value={skills.length}
          subtitle="Linked technologies"
          icon={Cpu}
          badgeText="Configured"
          badgeVariant="neutral"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a] uppercase tracking-wider">
          <Activity className="w-4 h-4 text-[#2563eb]" />
          Quick Actions
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/admin/projects/new">
            <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Project
            </Button>
          </Link>

          <Link to="/admin/blogs/new">
            <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Write Article
            </Button>
          </Link>

          <Link to="/admin/skills">
            <Button variant="outline" size="sm">
              Manage Stack
            </Button>
          </Link>

          <Link to="/admin/contact">
            <Button variant="primary" size="sm" leftIcon={<Mail className="w-3.5 h-3.5" />}>
              Open Inbox
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries & Recent Projects Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries Panel */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 overflow-hidden">
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Recent Inquiries
              </h3>
            </div>
            <Link
              to="/admin/contact"
              className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#94a3b8]">
                No contact inquiries received yet.
              </div>
            ) : (
              contacts.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to="/admin/contact"
                  className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors block"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a]">
                        {item.name}
                      </span>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      )}
                    </div>
                    <p className="text-xs text-[#475569] truncate max-w-sm">
                      {item.subject || item.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] shrink-0">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects Highlights */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 overflow-hidden">
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Featured Projects
              </h3>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {projects.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#94a3b8]">
                No projects created yet.
              </div>
            ) : (
              projects.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a] truncate">
                        {item.title}
                      </span>
                      <Badge
                        variant={item.status === 'published' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#475569] truncate max-w-sm">
                      {item.summary || 'No summary'}
                    </p>
                  </div>
                  <Link
                    to={`/admin/projects/${item.id}/edit`}
                    className="text-xs font-medium text-[#2563eb] hover:underline shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}