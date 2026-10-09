import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  GraduationCap,
  CreditCard,
  Clock,
  MapPin,
  Warning,
  FileArrowDown,
} from '@phosphor-icons/react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: dashboardApi.getStudentDashboard,
  });

  const attendance = data?.overallAttendancePercentage ?? 0;
  const isShortage = attendance < 75;

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-apple-blue/10 via-indigo-500/10 to-purple-500/10 border border-black/5 dark:border-white/10 glass-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">Semester {data?.student?.semester || 1}</Badge>
              <span className="text-xs text-apple-gray-500 font-mono">
                {data?.student?.enrollmentNumber || 'ENR-2026-00001'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
              Welcome, {data?.student?.name || 'Student'}
            </h1>
            <p className="text-xs md:text-sm text-apple-gray-500 dark:text-apple-gray-400">
              Department of {data?.student?.department || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/exams/marksheets')}
              icon={<FileArrowDown weight="duotone" className="h-4 w-4" />}
            >
              Marksheet PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/fees/my')}
              icon={<CreditCard weight="duotone" className="h-4 w-4" />}
            >
              Fee Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Card */}
        <Card hoverable className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Attendance
            </span>
            <div className="p-2 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-blue">
              <CalendarCheck weight="duotone" className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
                {isLoading ? '...' : `${attendance.toFixed(1)}%`}
              </span>
              {isShortage && (
                <Badge variant="danger" size="sm">
                  <Warning weight="bold" className="h-3 w-3 mr-1 inline" /> Shortage
                </Badge>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-apple-gray-200 dark:bg-apple-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isShortage ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, attendance))}%` }}
              />
            </div>
            <p className="text-[11px] text-apple-gray-500">
              {isShortage ? 'Below minimum 75% requirement' : 'Good standing (Eligible for exams)'}
            </p>
          </div>
        </Card>

        {/* CGPA Card */}
        <Card hoverable className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Academic Standing
            </span>
            <div className="p-2 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800 text-purple-500">
              <GraduationCap weight="duotone" className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1 mt-3">
            <span className="text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
              {isLoading ? '...' : (data?.cgpa ? data.cgpa.toFixed(2) : '8.45')}
            </span>
            <p className="text-xs text-apple-gray-500">Cumulative GPA (10.0 scale)</p>
          </div>
          <Link
            to="/exams/marksheets"
            className="text-xs text-apple-blue dark:text-apple-blue-dark font-medium hover:underline pt-2"
          >
            View Grade Breakdown →
          </Link>
        </Card>

        {/* Outstanding Fees Card */}
        <Card hoverable className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-apple-gray-400">
              Pending Fees
            </span>
            <div className="p-2 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800 text-rose-500">
              <CreditCard weight="duotone" className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1 mt-3">
            <span className="text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
              {isLoading ? '...' : `₹${(data?.pendingFeeAmount ?? 0).toLocaleString()}`}
            </span>
            <p className="text-xs text-apple-gray-500">
              {data?.pendingFeeAmount ? 'Due within current semester' : 'All semester dues cleared'}
            </p>
          </div>
          {data?.pendingFeeAmount ? (
            <Link
              to="/fees/my"
              className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline pt-2"
            >
              Pay Outstanding Balance →
            </Link>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
              ✓ No action required
            </span>
          )}
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-apple-gray-900 dark:text-white flex items-center gap-2">
          <Clock weight="duotone" className="h-5 w-5 text-apple-blue" />
          Today's Lectures
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-apple-gray-400">Loading timetable...</div>
        ) : !data?.todayClasses || data.todayClasses.length === 0 ? (
          <Card className="p-8 text-center text-apple-gray-400 text-xs">
            No classes scheduled for today. Enjoy your study time!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.todayClasses.map((cls, idx) => (
              <Card key={idx} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-700 dark:text-apple-gray-300">
                    {cls.courseCode}
                  </span>
                  <Badge variant="neutral" size="sm">Active</Badge>
                </div>
                <h4 className="text-sm font-semibold text-apple-gray-900 dark:text-white">
                  {cls.courseTitle}
                </h4>
                <div className="flex items-center gap-4 text-xs text-apple-gray-500 pt-1 border-t border-apple-gray-200/50 dark:border-apple-gray-800/50">
                  <span className="flex items-center gap-1">
                    <Clock weight="duotone" className="h-4 w-4" />
                    {cls.startTime.slice(0, 5)} - {cls.endTime.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin weight="duotone" className="h-4 w-4" />
                    Room {cls.roomNumber}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
