import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../../api/attendance';
import { academicsApi } from '../../api/academics';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { CheckCircle, XCircle, Clock, CalendarCheck } from '@phosphor-icons/react';

interface StudentRosterItem {
  studentId: number;
  name: string;
  enrollmentNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export const MarkAttendancePage: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [courseId, setCourseId] = useState<number>(1);
  const [classDate, setClassDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sessionType, setSessionType] = useState<'LECTURE' | 'LAB' | 'TUTORIAL'>('LECTURE');

  // Initial student roster (first 10 students for demo attendance session)
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { studentId: 1, name: 'Aarav Sharma', enrollmentNumber: 'ENR-2026-00001', status: 'PRESENT' },
    { studentId: 2, name: 'Ananya Patel', enrollmentNumber: 'ENR-2026-00002', status: 'PRESENT' },
    { studentId: 3, name: 'Rohan Gupta', enrollmentNumber: 'ENR-2026-00003', status: 'PRESENT' },
    { studentId: 4, name: 'Priya Iyer', enrollmentNumber: 'ENR-2026-00004', status: 'PRESENT' },
    { studentId: 5, name: 'Ishaan Verma', enrollmentNumber: 'ENR-2026-00005', status: 'PRESENT' },
    { studentId: 6, name: 'Kavya Nair', enrollmentNumber: 'ENR-2026-00006', status: 'PRESENT' },
    { studentId: 7, name: 'Aditya Rao', enrollmentNumber: 'ENR-2026-00007', status: 'ABSENT' },
    { studentId: 8, name: 'Diya Joshi', enrollmentNumber: 'ENR-2026-00008', status: 'PRESENT' },
    { studentId: 9, name: 'Kabir Mehta', enrollmentNumber: 'ENR-2026-00009', status: 'LATE' },
    { studentId: 10, name: 'Meera Pillai', enrollmentNumber: 'ENR-2026-00010', status: 'PRESENT' },
  ]);

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicsApi.getCourses({ size: 100 }),
  });

  const markMutation = useMutation({
    mutationFn: attendanceApi.createAttendanceSession,
    onSuccess: (data) => {
      addToast({
        type: 'success',
        title: 'Attendance Saved',
        message: `Successfully logged session #${data.id} (${roster.length} student records) into database!`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.response?.data?.message || 'Could not record attendance session.',
      });
    },
  });

  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setRoster((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    setRoster((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markMutation.mutate({
      courseId: Number(courseId),
      classDate,
      sessionType,
      records: roster.map((r) => ({
        studentId: r.studentId,
        status: r.status,
      })),
    });
  };

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const lateCount = roster.filter((r) => r.status === 'LATE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Daily Attendance Register
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Log student attendance records directly into the high-performance partitioned database
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            Present: {presentCount}
          </Badge>
          <Badge variant="danger" size="md">
            Absent: {absentCount}
          </Badge>
          <Badge variant="warning" size="md">
            Late: {lateCount}
          </Badge>
        </div>
      </div>

      {/* Session Config */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Input
            label="Class Date"
            type="date"
            value={classDate}
            onChange={(e) => setClassDate(e.target.value)}
            required
          />

          <Select
            label="Session Type"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value as any)}
          >
            <option value="LECTURE">LECTURE</option>
            <option value="LAB">LAB</option>
            <option value="TUTORIAL">TUTORIAL</option>
          </Select>
        </div>
      </Card>

      {/* Student Roster Table */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
            Enrolled Student Roster ({roster.length} students)
          </h3>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('PRESENT')}
            >
              All Present
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('ABSENT')}
            >
              All Absent
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-apple-gray-200/60 dark:border-apple-gray-800/60 text-xs font-semibold text-apple-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Enrollment ID</th>
                <th className="py-3 px-4 text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800/50">
              {roster.map((s) => (
                <tr key={s.studentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <td className="py-3 px-4 font-medium text-apple-gray-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-apple-gray-500">
                    {s.enrollmentNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.studentId, 'PRESENT')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          s.status === 'PRESENT'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-600 dark:text-apple-gray-400 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle weight="bold" className="h-3.5 w-3.5" /> Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.studentId, 'ABSENT')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          s.status === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-600 dark:text-apple-gray-400 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle weight="bold" className="h-3.5 w-3.5" /> Absent
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.studentId, 'LATE')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          s.status === 'LATE'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-600 dark:text-apple-gray-400 hover:bg-amber-50'
                        }`}
                      >
                        <Clock weight="bold" className="h-3.5 w-3.5" /> Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={markMutation.isPending}
            icon={<CalendarCheck weight="duotone" className="h-5 w-5" />}
          >
            Submit & Record Session
          </Button>
        </div>
      </Card>
    </div>
  );
};
