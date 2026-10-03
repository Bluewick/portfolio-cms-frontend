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
import { Plus, GripVertical, Edit2, Trash2, Quote, User } from 'lucide-react';
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

function SortableTestimonialItem({ item, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

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
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#0f172a] p-1 -ml-1 rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden flex items-center justify-center shrink-0">
            {item.avatar_url ? (
              <img
                src={item.avatar_url}
                alt={item.client_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <User className="w-5 h-5 text-[#94a3b8]" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#0f172a] truncate">{item.client_name}</h3>
            <p className="text-xs text-[#475569] truncate">
              {item.client_title} {item.company ? `• ${item.company}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative pl-6 pr-2 pt-1">
        <Quote className="w-4 h-4 text-[#cbd5e1] absolute top-1 left-0 shrink-0" />
        <p className="text-xs text-[#475569] italic leading-relaxed">
          "{item.quote}"
        </p>
      </div>
    </div>
  );
}

export function TestimonialsPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    company: '',
    avatar_url: '',
    quote: '',
    display_order: 1,
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/testimonials');
      return res.data?.data || [];
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reorderMutation = useMutation({
    mutationFn: async (items) => api.patch('/api/admin/testimonials/reorder', { items }),
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update order.'));
      queryClient.invalidateQueries({ queryKey: ['testimonials', 'admin'] });
    },
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex((item) => item.id === active.id);
    const newIndex = testimonials.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(testimonials, oldIndex, newIndex);
    queryClient.setQueryData(['testimonials', 'admin'], reordered);

    const payload = reordered.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    reorderMutation.mutate(payload);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingItem) {
        return api.put(`/api/admin/testimonials/${editingItem.id}`, payload);
      }
      return api.post('/api/admin/testimonials', payload);
    },
    onSuccess: () => {
      toast.success(editingItem ? 'Testimonial updated.' : 'Testimonial created.');
      queryClient.invalidateQueries({ queryKey: ['testimonials', 'admin'] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to save testimonial.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/api/admin/testimonials/${id}`),
    onSuccess: () => {
      toast.success('Testimonial deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['testimonials', 'admin'] });
      setItemToDelete(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete testimonial.'));
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      client_name: '',
      client_title: '',
      company: '',
      avatar_url: '',
      quote: '',
      display_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      client_title: item.client_title || '',
      company: item.company || '',
      avatar_url: item.avatar_url || '',
      quote: item.quote,
      display_order: item.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.client_name.trim() || !formData.quote.trim()) {
      toast.error('Client Name and Quote are required.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Client Testimonials</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage endorsements, client avatars, titles, and sequence display.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading testimonials...
          </span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-3">
            <Quote className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0f172a]">No Testimonials Yet</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            Add feedback from engineering peers, managers, or consulting clients.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenCreate}>
            Add First Testimonial
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={testimonials.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {testimonials.map((item) => (
                <SortableTestimonialItem
                  key={item.id}
                  item={item}
                  onEdit={handleOpenEdit}
                  onDelete={setItemToDelete}
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
        title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
        description="Include client identity, organizational role, and endorsement quote."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client / Endorser Name"
            required
            placeholder="e.g. Sarah Connor"
            value={formData.client_name}
            onChange={(e) => setFormData((p) => ({ ...p, client_name: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Professional Title"
              placeholder="e.g. VP of Engineering"
              value={formData.client_title}
              onChange={(e) => setFormData((p) => ({ ...p, client_title: e.target.value }))}
            />

            <Input
              label="Company"
              placeholder="e.g. Cyberdyne Innovations"
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
            />
          </div>

          <Textarea
            label="Quote"
            rows={4}
            required
            placeholder="Enter endorsement quote..."
            value={formData.quote}
            onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))}
          />

          <MediaUploader
            value={formData.avatar_url}
            onChange={(url) => setFormData((p) => ({ ...p, avatar_url: url }))}
            label="Client Avatar"
            description="Upload portrait image (WebP, PNG, JPEG)"
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
              {editingItem ? 'Update Testimonial' : 'Create Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title={`Delete endorsement from ${itemToDelete?.client_name}?`}
        message="This action permanently removes this quote from your portfolio."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation?.mutate(itemToDelete?.id)}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
}