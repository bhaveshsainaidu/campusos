import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicsApi } from '../../api/academics';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Plus, Warning, Clock, MapPin, User as UserIcon } from '@phosphor-icons/react';

export const TimetablePage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const queryClient = useQueryClient();
  const { addToast } = useNotificationStore();

  const [sectionId, setSectionId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clashError, setClashError] = useState<string | null>(null);

  // Form State for new slot
  const [courseId, setCourseId] = useState<number>(1);
  const [facultyId, setFacultyId] = useState<number>(1);
  const [classroomId, setClassroomId] = useState<number>(1);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // 1 = Monday
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('10:00:00');

  const { data: slots, isLoading } = useQuery({
    queryKey: ['timetable', sectionId],
    queryFn: () => academicsApi.getSectionTimetable(sectionId),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicsApi.getCourses({ size: 100 }),
  });

  const { data: classrooms } = useQuery({
    queryKey: ['classrooms'],
    queryFn: academicsApi.getClassrooms,
  });

  const createMutation = useMutation({
    mutationFn: academicsApi.createTimetableSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', sectionId] });
      addToast({
        type: 'success',
        title: 'Class Slot Scheduled',
        message: 'The timetable has been successfully updated with no conflicts.',
      });
      handleCloseModal();
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        setClashError(err.response?.data?.message || 'Conflict detected: Classroom or Faculty is already occupied during this timeslot!');
      } else {
        setClashError(err.response?.data?.message || 'Failed to schedule slot.');
      }
    },
  });

  const handleCloseModal = () => {
    setClashError(null);
    setIsModalOpen(false);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setClashError(null);
    createMutation.mutate({
      sectionId,
      courseId: Number(courseId),
      facultyId: Number(facultyId),
      classroomId: Number(classroomId),
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
    });
  };

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Academic Timetable Matrix
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Weekly class schedule grid with automated collision and overlap prevention
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              value={sectionId}
              onChange={(e) => setSectionId(Number(e.target.value))}
            >
              <option value={1}>Section A (Sem 1)</option>
              <option value={2}>Section B (Sem 1)</option>
              <option value={3}>Section A (Sem 3)</option>
            </Select>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus weight="bold" className="h-4 w-4" />}
            >
              Schedule Slot
            </Button>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-gray-400">Loading timetable...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {days.map((day) => {
            const daySlots = (slots || []).filter((s) => s.dayOfWeek === day.id);

            return (
              <Card key={day.id} className="p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
                  <h3 className="font-semibold text-sm text-apple-gray-900 dark:text-white">
                    {day.name}
                  </h3>
                  <span className="text-[11px] font-medium text-apple-gray-400">
                    {daySlots.length} {daySlots.length === 1 ? 'Slot' : 'Slots'}
                  </span>
                </div>

                {daySlots.length === 0 ? (
                  <div className="py-8 text-center text-xs text-apple-gray-400">
                    No classes scheduled
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3.5 rounded-xl bg-apple-gray-50 dark:bg-apple-gray-800/60 border border-apple-gray-200/70 dark:border-apple-gray-700/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-apple-blue dark:text-apple-blue-dark">
                            {slot.courseCode || 'CS101'}
                          </span>
                          <span className="text-[11px] text-apple-gray-500 flex items-center gap-1 font-mono">
                            <Clock weight="duotone" className="h-3.5 w-3.5" />
                            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-apple-gray-900 dark:text-white line-clamp-1">
                          {slot.courseTitle || 'Core Course'}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-apple-gray-500">
                          <span className="flex items-center gap-1">
                            <UserIcon weight="duotone" className="h-3 w-3" />
                            {slot.facultyName || 'Dr. Faculty'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin weight="duotone" className="h-3 w-3" />
                            {slot.classroomNumber || 'Hall A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Schedule Timetable Slot"
        description="Book a lecture room for a course. Conflict detection validates faculty and classroom availability."
      >
        <form onSubmit={handleSchedule} className="space-y-4 pt-2">
          {clashError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <Warning weight="bold" className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Scheduling Conflict Detected!</p>
                <p className="mt-0.5">{clashError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Course"
              value={courseId}
              onChange={(e) => setCourseId(Number(e.target.value))}
            >
              {coursesData?.content?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </Select>

            <Select
              label="Day of Week"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            >
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Classroom"
              value={classroomId}
              onChange={(e) => setClassroomId(Number(e.target.value))}
            >
              {classrooms?.map((cr) => (
                <option key={cr.id} value={cr.id}>
                  Room {cr.roomNumber} ({cr.building})
                </option>
              ))}
            </Select>

            <Select
              label="Faculty ID"
              value={facultyId}
              onChange={(e) => setFacultyId(Number(e.target.value))}
            >
              <option value={1}>Dr. Alan Turing (CS)</option>
              <option value={2}>Dr. Grace Hopper (CS)</option>
              <option value={3}>Dr. Claude Shannon (Math)</option>
              <option value={4}>Dr. John von Neumann (CS)</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              step="3600"
              value={startTime.slice(0, 5)}
              onChange={(e) => setStartTime(`${e.target.value}:00`)}
              required
            />
            <Input
              label="End Time"
              type="time"
              step="3600"
              value={endTime.slice(0, 5)}
              onChange={(e) => setEndTime(`${e.target.value}:00`)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Schedule Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
