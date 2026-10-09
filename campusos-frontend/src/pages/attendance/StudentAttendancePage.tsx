import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../../api/attendance';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Warning, CheckCircle, BookBookmark, CalendarCheck } from '@phosphor-icons/react';

export const StudentAttendancePage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['myAttendance'],
    queryFn: attendanceApi.getMyAttendance,
  });

  const percentage = data?.overallPercentage ?? 84.5;
  const isShortage = percentage < 75;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          My Attendance Profile
        </h1>
        <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
          Cumulative attendance records across registered semester courses
        </p>
      </div>

      {/* Aggregate Overview Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Overall Academic Attendance
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-apple-gray-900 dark:text-white">
                {isLoading ? '...' : `${percentage.toFixed(1)}%`}
              </span>
              {isShortage ? (
                <Badge variant="danger" size="md">
                  <Warning weight="bold" className="h-4 w-4 mr-1 inline" /> Shortage Alert (&lt; 75%)
                </Badge>
              ) : (
                <Badge variant="success" size="md">
                  <CheckCircle weight="bold" className="h-4 w-4 mr-1 inline" /> Exam Eligible
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-apple-gray-400">Attended</p>
              <p className="text-lg font-bold text-apple-gray-900 dark:text-white">
                {data?.attendedClasses ?? 28} Sessions
              </p>
            </div>
            <div className="h-8 w-px bg-apple-gray-200 dark:bg-apple-gray-800" />
            <div>
              <p className="text-xs text-apple-gray-400">Total Held</p>
              <p className="text-lg font-bold text-apple-gray-900 dark:text-white">
                {data?.totalClasses ?? 32} Sessions
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-apple-gray-200 dark:bg-apple-gray-800 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isShortage ? 'bg-rose-500' : 'bg-apple-blue'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-apple-gray-400">
            <span>0%</span>
            <span className="font-semibold text-rose-500">75% (Min. Criteria)</span>
            <span>100%</span>
          </div>
        </div>
      </Card>

      {/* Per Course Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-apple-gray-900 dark:text-white flex items-center gap-2">
          <BookBookmark weight="duotone" className="h-5 w-5 text-apple-blue" />
          Course Breakdown
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-apple-gray-400">Loading courses...</div>
        ) : !data?.courses || data.courses.length === 0 ? (
          <Card className="p-8 text-center text-apple-gray-400 text-xs">
            No subject records available.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.courses.map((course) => {
              const cShortage = course.percentage < 75;
              return (
                <Card key={course.courseId} hoverable className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300 font-mono">
                      {course.courseCode}
                    </span>
                    <Badge variant={cShortage ? 'danger' : 'success'} size="sm">
                      {course.percentage.toFixed(1)}%
                    </Badge>
                  </div>

                  <h4 className="text-sm font-semibold text-apple-gray-900 dark:text-white line-clamp-1">
                    {course.courseTitle}
                  </h4>

                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-apple-gray-200 dark:bg-apple-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          cShortage ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, course.percentage))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-apple-gray-500">
                      <span>{course.attended} / {course.total} attended</span>
                      <span>{course.total - course.attended} missed</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
