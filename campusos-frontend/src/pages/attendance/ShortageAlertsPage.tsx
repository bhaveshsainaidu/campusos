import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../../api/attendance';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Select } from '../../components/common/Input';
import { Warning, FunnelSimple } from '@phosphor-icons/react';

export const ShortageAlertsPage: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(75);

  const { data: students, isLoading } = useQuery({
    queryKey: ['attendanceShortage', threshold],
    queryFn: () => attendanceApi.getShortageStudents(threshold),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Attendance Shortage Registry
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
            Identify and flag enrolled students falling below university mandatory criteria
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelSimple weight="duotone" className="h-4 w-4 text-apple-gray-400" />
            <span className="text-xs text-apple-gray-500 font-medium">Cutoff:</span>
          </div>
          <div className="w-36">
            <Select
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            >
              <option value={80}>&lt; 80% (Strict)</option>
              <option value={75}>&lt; 75% (Mandatory)</option>
              <option value={70}>&lt; 70% (Critical)</option>
              <option value={60}>&lt; 60% (Severe)</option>
            </Select>
          </div>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
          <div className="flex items-center gap-2">
            <Warning weight="duotone" className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-semibold text-apple-gray-900 dark:text-white">
              Students at Risk ({students?.length ?? 0} Flagged)
            </h3>
          </div>
          <Badge variant="danger" size="sm">
            Action Required
          </Badge>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-apple-gray-400">
            Scanning 10,000+ student attendance records...
          </div>
        ) : !students || students.length === 0 ? (
          <div className="p-12 text-center text-xs text-emerald-600 dark:text-emerald-400">
            No students currently below {threshold}% attendance cutoff!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-apple-gray-200/60 dark:border-apple-gray-800/60 text-xs font-semibold text-apple-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Enrollment ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Classes Attended</th>
                  <th className="py-3 px-4 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-gray-100 dark:divide-apple-gray-800/50">
                {students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-medium text-apple-gray-900 dark:text-white">
                      {student.studentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-apple-gray-500">
                      {student.enrollmentNumber}
                    </td>
                    <td className="py-3 px-4 text-xs text-apple-gray-600 dark:text-apple-gray-400">
                      {student.departmentName || 'Computer Science'}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-mono">
                      {student.attendedClasses} / {student.totalClasses}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                        {student.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
