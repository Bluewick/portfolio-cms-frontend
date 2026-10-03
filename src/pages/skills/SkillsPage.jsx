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
import { Plus, GripVertical, Edit2, Trash2, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { Spinner } from '../../components/ui/Spinner';

const SKILL_CATEGORIES = [
  'Database',
  'Backend',
  'Frontend',
  'DevOps & Cloud',
  'Architecture',
  'Tools & Testing',
];

// Sortable Skill Row Item
function SortableSkillItem({ skill, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: skill.id });

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
      className="flex items-center justify-between p-3.5 bg-white border border-[#e2e8f0] rounded-xl hover:border-[#cbd5e1] transition-all shadow-level-1 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 rounded transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
          {skill.icon_url ? (
            <img
              src={skill.icon_url}
              alt={skill.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Cpu className="w-4 h-4 text-[#94a3b8]" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0f172a] truncate">{skill.name}</p>
          <Badge variant="neutral" size="sm" className="mt-0.5">
            {skill.category || 'General'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(skill)}
          className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          title="Edit Skill"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(skill)}
          className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
          title="Delete Skill"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function SkillsPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Database',
    icon_url: '',
    display_order: 1,
  });

  // Query skills list
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/skills');
      return res.data?.data || [];
    },
  });

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async (items) => {
      return api.patch('/api/admin/skills/reorder', { items });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save reorder state.'));
      queryClient.invalidateQueries({ queryKey: ['skills', 'admin'] });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = skills.findIndex((item) => item.id === active.id);
    const newIndex = skills.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(skills, oldIndex, newIndex);
    queryClient.setQueryData(['skills', 'admin'], reordered);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    reorderMutation.mutate(payload);
  };

  // Create / Update mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingSkill) {
        return api.put(`/api/admin/skills/${editingSkill.id}`, payload);
      }
      return api.post('/api/admin/skills', payload);
    },
    onSuccess: () => {
      toast.success(editingSkill ? 'Skill updated.' : 'Skill created.');
      queryClient.invalidateQueries({ queryKey: ['skills', 'admin'] });
      setIsModalOpen(false);
      setEditingSkill(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save skill.'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/api/admin/skills/${id}`);
    },
    onSuccess: () => {
      toast.success('Skill deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['skills', 'admin'] });
      setSkillToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete skill.'));
    },
  });

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Database',
      icon_url: '',
      display_order: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon_url: skill.icon_url || '',
      display_order: skill.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Skill Name is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Skills & Technology Stack</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage technical proficiencies, SVGs, and drag handles to adjust display hierarchy.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Skill
        </Button>
      </div>

      {/* Skills List Container */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading technology stack...
          </span>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-3">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0f172a]">No Skills Found</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Get started by adding your primary frameworks, databases, and architectural tools.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleOpenCreate}
          >
            Add First Skill
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {skills.map((skill) => (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  onEdit={handleOpenEdit}
                  onDelete={setSkillToDelete}
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
        title={editingSkill ? 'Edit Skill Entry' : 'Add New Skill'}
        description="Provide skill name, category taxonomy, and an SVG or image icon."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            required
            placeholder="e.g. PostgreSQL 16"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full h-10 px-3.5 text-sm bg-white text-[#0f172a] rounded-lg border border-[#e2e8f0] focus-halo"
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <MediaUploader
            value={formData.icon_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, icon_url: url }))}
            label="Skill Icon"
            description="Upload an SVG icon or WebP badge"
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
              {editingSkill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(skillToDelete)}
        title={`Delete "${skillToDelete?.name}"?`}
        message="Are you sure you want to remove this skill? Any project associations will be unlinked."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(skillToDelete?.id)}
        onClose={() => setSkillToDelete(null)}
      />
    </div>
  );
}