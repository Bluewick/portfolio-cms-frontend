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
import { Plus, GripVertical, Edit2, Trash2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MediaUploader } from '../../components/shared/MediaUploader';
import { Spinner } from '../../components/ui/Spinner';

function SortableServiceItem({ service, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: service.id });

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
      className="p-5 bg-white border border-[#e2e8f0] rounded-xl hover:border-[#cbd5e1] transition-all shadow-level-1 group flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-4 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 rounded transition-colors mt-1"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center p-2.5 shrink-0 overflow-hidden border border-[#dbeafe]">
          {service.icon_url ? (
            <img
              src={service.icon_url}
              alt={service.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Layers className="w-6 h-6" />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-bold text-[#0f172a] truncate">{service.title}</h3>
          <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => onEdit(service)}
          className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(service)}
          className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ServicesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_url: '',
    display_order: 1,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/services');
      return res.data?.data || [];
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderMutation = useMutation({
    mutationFn: async (items) => api.patch('/api/admin/services/reorder', { items }),
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update order.'));
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((item) => item.id === active.id);
    const newIndex = services.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(services, oldIndex, newIndex);
    queryClient.setQueryData(['services', 'admin'], reordered);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    reorderMutation.mutate(payload);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingService) {
        return api.put(`/api/admin/services/${editingService.id}`, payload);
      }
      return api.post('/api/admin/services', payload);
    },
    onSuccess: () => {
      toast.success(editingService ? 'Service updated.' : 'Service created.');
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
      setIsModalOpen(false);
      setEditingService(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save service.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/api/admin/services/${id}`),
    onSuccess: () => {
      toast.success('Service deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['services', 'admin'] });
      setServiceToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete service.'));
    },
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon_url: '',
      display_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon_url: service.icon_url || '',
      display_order: service.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and Description are required.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Service Offerings</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Configure architectural and engineering services displayed on your portfolio.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading services...
          </span>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0f172a]">No Services Found</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Outline your engineering capabilities (e.g. Distributed Systems, Cloud Architecture).
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenCreate}>
            Add First Service
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={services.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {services.map((service) => (
                <SortableServiceItem
                  key={service.id}
                  service={service}
                  onEdit={handleOpenEdit}
                  onDelete={setServiceToDelete}
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
        title={editingService ? 'Edit Service' : 'Add Service Offering'}
        description="Provide service title, overview description, and an icon."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title"
            required
            placeholder="e.g. Full-Stack Cloud Engineering"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          />

          <Textarea
            label="Description"
            rows={4}
            required
            placeholder="Explain value delivered, tech employed, and architectural focus..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />

          <MediaUploader
            value={formData.icon_url}
            onChange={(url) => setFormData((p) => ({ ...p, icon_url: url }))}
            label="Service Icon"
            description="Upload an SVG or WebP icon"
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
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        title={`Delete "${serviceToDelete?.title}"?`}
        message="This action permanently removes this service offering from your portfolio."
        isLoading={deleteMutation?.isPending}
        onConfirm={() => deleteMutation?.mutate(serviceToDelete?.id)}
        onClose={() => setServiceToDelete(null)}
      />
    </div>
  );
}