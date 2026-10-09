import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '../../api/notices';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Megaphone, Plus, BellRinging, CalendarBlank } from '@phosphor-icons/react';

export const NoticesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [audienceFilter, setAudienceFilter] = useState<'ALL' | 'STUDENT' | 'FACULTY' | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENT' | 'FACULTY'>('ALL');

  const { data: notices, isLoading } = useQuery({
    queryKey: ['notices', audienceFilter],
    queryFn: () => noticesApi.getNotices(audienceFilter || undefined),
  });

  const createMutation = useMutation({
    mutationFn: noticesApi.createNotice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      addToast({
        type: 'success',
        title: 'Notice Broadcasted',
        message: `"${data.title}" broadcasted live to ${data.targetAudience} channels.`,
      });
      handleCloseModal();
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Broadcast Failed',
        message: err.response?.data?.message || 'Could not publish announcement.',
      });
    },
  });

  const handleCloseModal = () => {
    setTitle('');
    setContent('');
    setPriority('HIGH');
    setTargetAudience('ALL');
    setIsModalOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      content,
      priority,
      targetAudience,
    });
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
        return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="neutral">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Campus Bulletin & Notices
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Real-time announcements streamed via STOMP WebSocket communication
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value as any)}
            >
              <option value="">All Audiences</option>
              <option value="ALL">Campus-wide (ALL)</option>
              <option value="STUDENT">Students Only</option>
              <option value="FACULTY">Faculty Only</option>
            </Select>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus weight="bold" className="h-4 w-4" />}
            >
              Publish Notice
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading announcements...</div>
      ) : !notices || notices.length === 0 ? (
        <Card className="p-12 text-center text-apple-gray-400 text-xs">
          No announcements found matching the filter.
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <Card key={n.id} hoverable className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-blue dark:text-apple-blue-dark">
                    <Megaphone weight="duotone" className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-apple-gray-900 dark:text-white">
                    {n.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">
                    Audience: {n.targetAudience}
                  </Badge>
                  {getPriorityBadge(n.priority)}
                </div>
              </div>

              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-300 leading-relaxed pl-11">
                {n.content}
              </p>

              <div className="flex items-center justify-between pt-3 pl-11 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 text-xs text-apple-gray-400">
                <span className="flex items-center gap-1.5">
                  <CalendarBlank weight="duotone" className="h-4 w-4" />
                  Published: {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'Today'}
                </span>
                <span>By: {n.authorName || 'Office of Academic Affairs'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Broadcast Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Broadcast Announcement"
        description="Publish a notice. A WebSocket STOMP notification will immediately push to connected users."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <Input
            label="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fall Semester Mid-Term Examination Schedule"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-apple-gray-600 dark:text-apple-gray-400">
              Content & Details
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Full announcement text..."
              required
              className="w-full rounded-xl border border-apple-gray-200 dark:border-apple-gray-750 bg-white/70 dark:bg-apple-gray-900/70 p-3 text-sm focus:outline-none focus:ring-4 focus:ring-apple-blue/10 dark:focus:ring-apple-blue-dark/20 focus:border-apple-blue text-apple-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </Select>

            <Select
              label="Target Audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
            >
              <option value="ALL">Campus-wide (ALL)</option>
              <option value="STUDENT">Students Only</option>
              <option value="FACULTY">Faculty Only</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              icon={<BellRinging weight="bold" className="h-4 w-4" />}
            >
              Broadcast Live
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
