import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  CheckCircle,
  CalendarCheck,
  BookBookmark,
  Users,
} from '@phosphor-icons/react';

export const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['facultyDashboard'],
    queryFn: dashboardApi.getFacultyDashboard,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Faculty Command Center
        </h1>
        <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-1">
          Manage your lecture sessions, record attendance, and track course evaluations
        </p>
      </div>

      {/* Today's Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-apple-gray-900 dark:text-white flex items-center gap-2">
            <Clock weight="duotone" className="h-5 w-5 text-apple-blue" />
            Today's Teaching Schedule
          </h2>
          <span className="text-xs text-apple-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-apple-gray-400">Loading schedule...</div>
        ) : !data?.classesToday || data.classesToday.length === 0 ? (
          <Card className="p-8 text-center text-apple-gray-400 text-xs">
            No lecture sessions scheduled for today. Have a productive day!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.classesToday.map((cls) => (
              <Card key={cls.id} hoverable className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300">
                      {cls.courseCode}
                    </span>
                    {cls.isAttendanceMarked ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle weight="bold" className="h-3 w-3 mr-1 inline" /> Logged
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-apple-gray-900 dark:text-white line-clamp-1">
                    {cls.courseTitle}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-apple-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock weight="duotone" className="h-4 w-4" />
                      {cls.startTime.slice(0, 5)} - {cls.endTime.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin weight="duotone" className="h-4 w-4" />
                      Room {cls.roomNumber}
                    </span>
                  </div>
                </div>

                <Button
                  variant={cls.isAttendanceMarked ? 'secondary' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/attendance/mark')}
                  icon={<CalendarCheck weight="duotone" className="h-4 w-4" />}
                >
                  {cls.isAttendanceMarked ? 'Review Roster' : 'Mark Attendance'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Courses */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-apple-gray-900 dark:text-white flex items-center gap-2">
          <BookBookmark weight="duotone" className="h-5 w-5 text-purple-500" />
          My Assigned Courses
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-apple-gray-400">Loading courses...</div>
        ) : !data?.activeCourses || data.activeCourses.length === 0 ? (
          <Card className="p-8 text-center text-apple-gray-400 text-xs">
            No active courses assigned.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.activeCourses.map((c) => (
              <Card key={c.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300">
                    {c.code}
                  </span>
                  <span className="text-xs text-apple-gray-500 font-medium">
                    {c.credits} Credits
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                  {c.title}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50 text-xs">
                  <span className="text-apple-gray-500 flex items-center gap-1.5">
                    <Users weight="duotone" className="h-4 w-4" />
                    {c.studentCount} Students
                  </span>
                  <Link
                    to="/exams/marks"
                    className="text-apple-blue dark:text-apple-blue-dark font-medium hover:underline"
                  >
                    Enter Marks →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
