import React, { useState } from 'react';
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
import { Plus, GripVertical, Edit2, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

// Helper to format ISO dates to readable text
function formatDateRange(startDate, endDate, isCurrent) {
  if (!startDate) return '';
  const start = new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  if (isCurrent) return `${start} – Present`;
  if (!endDate) return start;
  const end = new Date(endDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  return `${start} – ${end}`;
}

// Helper to format ISO to HTML date input YYYY-MM-DD
function toDateInputValue(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
}

function SortableExperienceItem({ exp, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exp.id });

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
      className="p-5 bg-white border border-[#e2e8f0] rounded-xl hover:border-[#cbd5e1] transition-all shadow-level-1 group space-y-3"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 rounded transition-colors mt-0.5"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#0f172a]">{exp.role}</h3>
              <span className="text-xs text-[#94a3b8]">at</span>
              <span className="text-xs font-semibold text-[#2563eb]">{exp.company}</span>
              {exp.is_current && (
                <Badge variant="success" size="sm" dot>Current</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-1 text-xs text-[#475569] flex-wrap">
              {exp.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#94a3b8]" />
                  {exp.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(exp)}
            className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(exp)}
            className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {exp.description && (
        <p className="text-xs text-[#475569] leading-relaxed pl-7 border-l-2 border-[#f1f5f9]">
          {exp.description}
        </p>
      )}
    </div>
  );
}

export function ExperiencesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expToDelete, setExpToDelete] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    display_order: 1,
  });

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experiences', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/experiences');
      return res.data?.data || [];
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderMutation = useMutation({
    mutationFn: async (items) => api.patch('/api/admin/experiences/reorder', { items }),
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update order.'));
      queryClient.invalidateQueries({ queryKey: ['experiences', 'admin'] });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex((item) => item.id === active.id);
    const newIndex = experiences.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(experiences, oldIndex, newIndex);
    queryClient.setQueryData(['experiences', 'admin'], reordered);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    reorderMutation.mutate(payload);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const cleanPayload = {
        ...payload,
        end_date: payload.is_current ? null : payload.end_date || null,
      };

      if (editingExp) {
        return api.put(`/api/admin/experiences/${editingExp.id}`, cleanPayload);
      }
      return api.post('/api/admin/experiences', cleanPayload);
    },
    onSuccess: () => {
      toast.success(editingExp ? 'Experience updated.' : 'Experience created.');
      queryClient.invalidateQueries({ queryKey: ['experiences', 'admin'] });
      setIsModalOpen(false);
      setEditingExp(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save experience.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/api/admin/experiences/${id}`),
    onSuccess: () => {
      toast.success('Experience deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['experiences', 'admin'] });
      setExpToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete entry.'));
    },
  });

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      display_order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      start_date: toDateInputValue(exp.start_date),
      end_date: toDateInputValue(exp.end_date),
      is_current: exp.is_current || false,
      description: exp.description || '',
      display_order: exp.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim() || !formData.start_date) {
      toast.error('Company, Role, and Start Date are required.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Career Timeline</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage your professional positions, tenure, locations, and accomplishments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading career history...
          </span>
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0f172a]">No Experiences Listed</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Document your career history to populate your portfolio timeline.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenCreate}>
            Add First Position
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experiences.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {experiences.map((exp) => (
                <SortableExperienceItem
                  key={exp.id}
                  exp={exp}
                  onEdit={handleOpenEdit}
                  onDelete={setExpToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add Experience Entry'}
        description="Fill out position details, organization, tenure, and achievements."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Role / Title"
              required
              placeholder="e.g. Lead Backend Architect"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            />

            <Input
              label="Company Name"
              required
              placeholder="e.g. ScaleUp Systems"
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
            />
          </div>

          <Input
            label="Location"
            placeholder="e.g. San Francisco, CA (Remote)"
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
            />

            <Input
              label="End Date"
              type="date"
              disabled={formData.is_current}
              value={formData.end_date}
              onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_current}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  is_current: e.target.checked,
                  end_date: e.target.checked ? '' : p.end_date,
                }))
              }
              className="w-4 h-4 rounded text-[#2563eb] border-[#e2e8f0] focus:ring-[#2563eb]"
            />
            <span className="text-xs font-semibold text-[#0f172a]">
              Currently working in this role
            </span>
          </label>

          <Textarea
            label="Description & Achievements"
            rows={4}
            placeholder="Describe system accomplishments, scale managed, databases redesigned..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saveMutation.isPending}
            >
              {editingExp ? 'Update Experience' : 'Save Experience'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(expToDelete)}
        title={`Delete role at ${expToDelete?.company}?`}
        message="This action permanently deletes this experience from your public timeline."
        isLoading={deleteMutation?.isPending}
        onConfirm={() => deleteMutation?.mutate(expToDelete?.id)}
        onClose={() => setExpToDelete(null)}
      />
    </div>
  );
}