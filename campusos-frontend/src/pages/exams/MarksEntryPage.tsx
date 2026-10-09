import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { examsApi } from '../../api/exams';
import { academicsApi } from '../../api/academics';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select, Input } from '../../components/common/Input';
import { FileText, CheckCircle } from '@phosphor-icons/react';

interface StudentMarkRow {
  studentId: number;
  name: string;
  enrollmentNumber: string;
  marksObtained: number;
  maxMarks: number;
}

export const MarksEntryPage: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [examId, setExamId] = useState<number>(1);
  const [courseId, setCourseId] = useState<number>(1);

  const [marksRows, setMarksRows] = useState<StudentMarkRow[]>([
    { studentId: 1, name: 'Aarav Sharma', enrollmentNumber: 'ENR-2026-00001', marksObtained: 88, maxMarks: 100 },
    { studentId: 2, name: 'Ananya Patel', enrollmentNumber: 'ENR-2026-00002', marksObtained: 92, maxMarks: 100 },
    { studentId: 3, name: 'Rohan Gupta', enrollmentNumber: 'ENR-2026-00003', marksObtained: 76, maxMarks: 100 },
    { studentId: 4, name: 'Priya Iyer', enrollmentNumber: 'ENR-2026-00004', marksObtained: 85, maxMarks: 100 },
    { studentId: 5, name: 'Ishaan Verma', enrollmentNumber: 'ENR-2026-00005', marksObtained: 68, maxMarks: 100 },
    { studentId: 6, name: 'Kavya Nair', enrollmentNumber: 'ENR-2026-00006', marksObtained: 95, maxMarks: 100 },
  ]);

  const { data: exams } = useQuery({
    queryKey: ['exams'],
    queryFn: examsApi.getExams,
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicsApi.getCourses({ size: 100 }),
  });

  const marksMutation = useMutation({
    mutationFn: examsApi.submitMarks,
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Marks Recorded',
        message: `Successfully evaluated ${marksRows.length} student scores. SGPA and CGPA updated!`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: err.response?.data?.message || 'Could not save marks.',
      });
    },
  });

  const handleMarkChange = (studentId: number, val: number) => {
    setMarksRows((prev) =>
      prev.map((r) =>
        r.studentId === studentId
          ? { ...r, marksObtained: Math.min(r.maxMarks, Math.max(0, val)) }
          : r
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    marksMutation.mutate({
      examId: Number(examId),
      courseId: Number(courseId),
      marks: marksRows.map((r) => ({
        studentId: r.studentId,
        marksObtained: r.marksObtained,
        maxMarks: r.maxMarks,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Examination Marks Registry
        </h1>
        <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
          Record student evaluation scores and compute automated grade weightings
        </p>
      </div>

      {/* Selectors */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Examination"
            value={examId}
            onChange={(e) => setExamId(Number(e.target.value))}
          >
            {exams?.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} (Sem {exam.semester})
              </option>
            ))}
          </Select>

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
        </div>
      </Card>

      {/* Roster & Marks Input Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
            Course Evaluation Roster
          </h3>
          <span className="text-xs text-apple-gray-500">
            Scale: 0 to 100 Marks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-apple-gray-200/60 dark:border-apple-gray-800/60 text-xs font-semibold text-apple-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Enrollment ID</th>
                <th className="py-3 px-4 text-center">Marks Obtained (out of 100)</th>
                <th className="py-3 px-4 text-center">Grade Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800/50">
              {marksRows.map((row) => {
                const grade =
                  row.marksObtained >= 90
                    ? 'A+'
                    : row.marksObtained >= 80
                    ? 'A'
                    : row.marksObtained >= 70
                    ? 'B'
                    : row.marksObtained >= 60
                    ? 'C'
                    : 'F';

                return (
                  <tr key={row.studentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-medium text-apple-gray-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-apple-gray-500">
                      {row.enrollmentNumber}
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      <div className="w-24">
                        <Input
                          type="number"
                          min={0}
                          max={row.maxMarks}
                          value={row.marksObtained}
                          onChange={(e) => handleMarkChange(row.studentId, Number(e.target.value))}
                          className="text-center font-mono font-semibold"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                        grade === 'F' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            isLoading={marksMutation.isPending}
            icon={<CheckCircle weight="bold" className="h-5 w-5" />}
          >
            Save Marks & Compute GPA
          </Button>
        </div>
      </Card>
    </div>
  );
};
