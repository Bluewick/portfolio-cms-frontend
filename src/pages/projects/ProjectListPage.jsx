import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  FolderGit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

function SortableProjectRow({ project, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white border border-[#e2e8f0] rounded-xl hover:border-[#cbd5e1] transition-all shadow-level-1 group gap-4"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 rounded transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden flex items-center justify-center shrink-0">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <FolderGit2 className="w-6 h-6 text-[#94a3b8]" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-[#0f172a] truncate">
              {project.title}
            </h3>

            {project.is_featured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f59e0b] bg-[#fffbeb] px-1.5 py-0.5 rounded border border-[#fef3c7]">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}

            <Badge
              variant={project.status === 'published' ? 'success' : 'warning'}
              size="sm"
              dot
            >
              {project.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>

          <p className="text-xs text-[#475569] truncate max-w-xl">
            {project.summary || 'No summary text provided.'}
          </p>

          {/* Linked Skills Badges */}
          {project.skills && project.skills.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {project.skills.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  className="text-[10px] font-semibold px-1.5 py-0.2 bg-[#f1f5f9] text-[#475569] rounded"
                >
                  {s.name}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="text-[10px] text-[#94a3b8]">
                  +{project.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#94a3b8] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-lg transition-colors"
            title="Open Live URL"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <button
          type="button"
          onClick={() => onEdit(project)}
          className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          title="Edit Project"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(project)}
          className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
          title="Delete Project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ProjectListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [projectToDelete, setProjectToDelete] = useState(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/projects');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderMutation = useMutation({
    mutationFn: async (items) => api.patch('/api/admin/projects/reorder', { items }),
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update order.'));
      queryClient.invalidateQueries({ queryKey: ['projects', 'admin'] });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(projects, oldIndex, newIndex);
    queryClient.setQueryData(['projects', 'admin'], reordered);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    reorderMutation.mutate(payload);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/api/admin/projects/${id}`),
    onSuccess: () => {
      toast.success('Project deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['projects', 'admin'] });
      setProjectToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete project.'));
    },
  });

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'published') return p.status === 'published';
    if (statusFilter === 'draft') return p.status === 'draft';
    return true;
  });

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Projects Management</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Create, publish, and reorder engineering projects and tech stack associations.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        </Link>
      </div>

      {/* Filter Segmented Control */}
      <SegmentedControl
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: 'All Projects', value: 'all', count: projects.length },
          { label: 'Published', value: 'published', count: publishedCount },
          { label: 'Drafts', value: 'draft', count: draftCount },
        ]}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading projects...
          </span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <FolderGit2 className="w-8 h-8 text-[#94a3b8] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#0f172a]">No projects found</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'Add your first engineering portfolio project.'
              : `No projects currently in ${statusFilter} status.`}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredProjects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <SortableProjectRow
                  key={project.id}
                  project={project}
                  onEdit={(p) => navigate(`/admin/projects/${p.id}/edit`)}
                  onDelete={setProjectToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        title={`Delete "${projectToDelete?.title}"?`}
        message="This will permanently delete this project, its links, and skill associations."
        isLoading={deleteMutation?.isPending}
        onConfirm={() => deleteMutation?.mutate(projectToDelete?.id)}
        onClose={() => setProjectToDelete(null)}
      />
    </div>
  );
}