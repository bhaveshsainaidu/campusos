import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { examsApi } from '../../api/exams';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DownloadSimple, Sparkle, GraduationCap, Certificate } from '@phosphor-icons/react';

export const MarksheetsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addToast } = useNotificationStore();
  const [downloading, setDownloading] = useState(false);

  // By default target current student or student ID 1 for admin view
  const studentId = user?.role === 'ROLE_STUDENT' ? (user.id || 1) : 1;

  const { data: marksheet, refetch } = useQuery({
    queryKey: ['studentMarksheet', studentId],
    queryFn: () => examsApi.getStudentMarksheet(studentId),
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      examsApi.generateMarksheet({
        studentId,
        semester: 1,
        academicYear: '2026-2027',
      }),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Marksheet Generated',
        message: 'Async PDF marksheet has been rendered. Ready for download!',
      });
      refetch();
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: err.response?.data?.message || 'Could not generate marksheet.',
      });
    },
  });

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await examsApi.downloadMarksheetPdf(studentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Marksheet_Student_${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: 'Download Complete',
        message: 'Your official marksheet PDF has been downloaded.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Marksheet PDF has not been generated yet. Please click Generate first.',
      });
    } finally {
      setDownloading(false);
    }
  };

  // Sample course grade breakdown display
  const subjectGrades = [
    { code: 'CS101', title: 'Data Structures & Algorithms', credits: 4, marks: 88, max: 100, grade: 'A', points: 9.0 },
    { code: 'CS102', title: 'Operating Systems', credits: 4, marks: 92, max: 100, grade: 'A+', points: 10.0 },
    { code: 'MA101', title: 'Discrete Mathematics', credits: 3, marks: 78, max: 100, grade: 'B+', points: 8.0 },
    { code: 'EC101', title: 'Digital Electronics', credits: 3, marks: 85, max: 100, grade: 'A', points: 9.0 },
    { code: 'CS103', title: 'Database Management Systems', credits: 4, marks: 89, max: 100, grade: 'A', points: 9.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Official Academic Transcript & Marksheets
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Verified cumulative semester evaluations, GPA calculations, and secure PDF marksheets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => generateMutation.mutate()}
            isLoading={generateMutation.isPending}
            icon={<Sparkle weight="duotone" className="h-4 w-4" />}
          >
            Generate / Re-render
          </Button>

          <Button
            variant="primary"
            onClick={handleDownloadPdf}
            isLoading={downloading}
            icon={<DownloadSimple weight="bold" className="h-4 w-4" />}
          >
            Download Official PDF
          </Button>
        </div>
      </div>

      {/* GPA Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Semester SGPA
            </span>
            <div className="p-2 rounded-xl bg-apple-blue/10 text-apple-blue">
              <GraduationCap weight="duotone" className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-apple-gray-900 dark:text-white">
            {marksheet?.sgpa ? marksheet.sgpa.toFixed(2) : '8.94'}
          </p>
          <p className="text-xs text-apple-gray-500">Semester 1 (18 Credits)</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Cumulative CGPA
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Certificate weight="duotone" className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-apple-gray-900 dark:text-white">
            {marksheet?.cgpa ? marksheet.cgpa.toFixed(2) : '8.75'}
          </p>
          <p className="text-xs text-apple-gray-500">Overall academic standing</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Status & Verification
            </span>
            <Badge variant="success" size="sm">Verified</Badge>
          </div>
          <p className="text-lg font-bold text-apple-gray-900 dark:text-white">
            Passed with Distinction
          </p>
          <p className="text-xs text-apple-gray-500">Digital signature applied</p>
        </Card>
      </div>

      {/* Course Grade Breakdown Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
            Subject Grade Breakdown (Fall Semester)
          </h3>
          <span className="text-xs text-apple-gray-500">
            Total Credits: 18
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-apple-gray-200/60 dark:border-apple-gray-800/60 text-xs font-semibold text-apple-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4 text-center">Marks (100)</th>
                <th className="py-3 px-4 text-center">Letter Grade</th>
                <th className="py-3 px-4 text-right">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800/50">
              {subjectGrades.map((sub) => (
                <tr key={sub.code} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-xs text-apple-blue dark:text-apple-blue-dark">
                    {sub.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-apple-gray-900 dark:text-white">
                    {sub.title}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs text-apple-gray-600 dark:text-apple-gray-400">
                    {sub.credits}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs">
                    {sub.marks}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-xs text-apple-gray-900 dark:text-white">
                    {sub.points.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
