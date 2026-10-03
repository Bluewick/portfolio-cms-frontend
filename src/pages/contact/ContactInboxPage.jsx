import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  MailOpen,
  Reply,
  Copy,
  Check,
  Globe,
  Clock,
  ChevronLeft,
  ChevronRight,
  Inbox,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export function ContactInboxPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Fetch paginated messages
  const { data: inboxResponse, isLoading } = useQuery({
    queryKey: ['contacts', 'admin', page],
    queryFn: async () => {
      const res = await api.get(`/api/admin/contact?page=${page}&limit=10`);
      return res.data;
    },
  });

  const messages = inboxResponse?.data || [];
  const meta = inboxResponse?.meta || { page: 1, limit: 10, total: 0, total_pages: 1 };

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      return api.patch(`/api/admin/contact/${id}/read`, { is_read: true });
    },
    onSuccess: (_, messageId) => {
      // Optimistically update list in cache
      queryClient.setQueryData(['contacts', 'admin', page], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((msg) =>
            msg.id === messageId ? { ...msg, is_read: true } : msg
          ),
        };
      });

      // Invalidate sidebar counter
      queryClient.invalidateQueries({
        queryKey: ['contacts', 'admin', 'unread-count'],
      });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update message status.'));
    },
  });

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    // If unread, auto-trigger background read patch
    if (!msg.is_read) {
      markAsReadMutation.mutate(msg.id);
      setSelectedMessage({ ...msg, is_read: true });
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setHasCopied(true);
    toast.success('Email copied to clipboard');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Contact Messages Inbox</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Review incoming consulting inquiries, partnership proposals, and collaboration requests.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" className="text-[#2563eb]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Loading messages...
          </span>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center shadow-level-1">
          <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0f172a]">Inbox is empty</h3>
          <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto">
            When visitors submit inquiries through your public contact form, they will appear here.
          </p>
        </div>
      ) : (
        /* Master-Detail Split Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          {/* Left Column: Message List (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 flex flex-col overflow-hidden">
            <div className="p-3.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#475569]">
                {meta.total} Total Messages
              </span>
              <span className="text-[#94a3b8]">Page {meta.page} of {meta.total_pages}</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-[#eff6ff] border-l-4 border-[#2563eb]'
                        : 'hover:bg-[#f8fafc]'
                    }`}
                  >
                    {/* Unread Indicator Dot */}
                    <div className="pt-1.5 shrink-0">
                      {!msg.is_read ? (
                        <span className="block w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                      ) : (
                        <span className="block w-2.5 h-2.5 rounded-full bg-transparent" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs truncate ${
                            !msg.is_read
                              ? 'font-bold text-[#0f172a]'
                              : 'font-medium text-[#475569]'
                          }`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-[#94a3b8] shrink-0">
                          {new Date(msg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <p
                        className={`text-xs truncate ${
                          !msg.is_read
                            ? 'font-semibold text-[#0f172a]'
                            : 'text-[#475569]'
                        }`}
                      >
                        {msg.subject || '(No Subject)'}
                      </p>

                      <p className="text-[11px] text-[#94a3b8] truncate">
                        {msg.message}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination Footer */}
            {meta.total_pages > 1 && (
              <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Message Inspection Details (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-xl shadow-level-1 flex flex-col overflow-hidden">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Message Header */}
                <div className="p-6 border-b border-[#e2e8f0] space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center font-bold text-sm shrink-0">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0f172a]">
                          {selectedMessage.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#475569]">
                          <span>{selectedMessage.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(selectedMessage.email)}
                            className="text-[#94a3b8] hover:text-[#0f172a] p-0.5 rounded transition-colors"
                            title="Copy Email"
                          >
                            {hasCopied ? (
                              <Check className="w-3.5 h-3.5 text-[#10b981]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                          selectedMessage.subject || 'Portfolio Inquiry'
                        )}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply via Email
                      </a>
                    </div>
                  </div>

                  {/* Subject & Metadata Badges */}
                  <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                    <h4 className="text-sm font-bold text-[#0f172a]">
                      {selectedMessage.subject || '(No Subject Provided)'}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-[#94a3b8] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>

                      {selectedMessage.ip_address && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          IP: {selectedMessage.ip_address}
                        </span>
                      )}

                      <Badge variant="success" size="sm" dot>
                        Received
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="text-sm text-[#0f172a] leading-relaxed whitespace-pre-wrap font-normal">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty Selection State */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#94a3b8]">
                <Mail className="w-12 h-12 mb-3 opacity-40 text-[#cbd5e1]" />
                <h4 className="text-sm font-semibold text-[#0f172a]">
                  No message selected
                </h4>
                <p className="text-xs text-[#475569] mt-1 max-w-xs">
                  Choose an inquiry from the left panel to inspect sender information and message body.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}