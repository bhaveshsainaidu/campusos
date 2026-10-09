import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../../api/exams';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { GraduationCap, Plus, Calendar } from '@phosphor-icons/react';

export const ExamSchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-30');

  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: examsApi.getExams,
  });

  const createMutation = useMutation({
    mutationFn: examsApi.createExam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      addToast({
        type: 'success',
        title: 'Exam Scheduled',
        message: `${data.name} scheduled for ${startDate} to ${endDate}.`,
      });
      handleCloseModal();
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Failed to Schedule',
        message: err.response?.data?.message || 'Could not schedule exam.',
      });
    },
  });

  const handleCloseModal = () => {
    setName('');
    setSemester(1);
    setIsModalOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      semester: Number(semester),
      academicYear,
      startDate,
      endDate,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <Badge variant="warning">Ongoing</Badge>;
      case 'COMPLETED':
        return <Badge variant="neutral">Completed</Badge>;
      case 'RESULTS_PUBLISHED':
        return <Badge variant="success">Results Published</Badge>;
      default:
        return <Badge variant="info">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Examinations Registry
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Semester mid-term and end-term evaluations schedule
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus weight="bold" className="h-4 w-4" />}
          >
            Schedule Examination
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading exams...</div>
      ) : !exams || exams.length === 0 ? (
        <Card className="p-12 text-center text-apple-gray-400 text-xs">
          No examination schedules announced yet.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <Card key={exam.id} hoverable className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-800 flex items-center justify-center text-purple-500">
                  <GraduationCap weight="duotone" className="h-6 w-6" />
                </div>
                {getStatusBadge(exam.status)}
              </div>

              <div>
                <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
                  {exam.name}
                </h3>
                <p className="text-xs text-apple-gray-500 mt-0.5">
                  Semester {exam.semester} • Academic Year {exam.academicYear}
                </p>
              </div>

              <div className="pt-3 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 flex items-center gap-2 text-xs text-apple-gray-500">
                <Calendar weight="duotone" className="h-4 w-4 text-apple-blue" />
                <span>
                  {exam.startDate} to {exam.endDate}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Schedule University Examination"
        description="Set up a new semester assessment window across departments."
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <Input
            label="Examination Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. End Semester Fall 2026"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Semester"
              type="number"
              min={1}
              max={8}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              required
            />
            <Input
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-2027"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Schedule Exam
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
