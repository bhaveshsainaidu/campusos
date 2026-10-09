import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import {
  Student,
  ChalkboardTeacher,
  Buildings,
  BookBookmark,
  Receipt,
  ArrowUpRight,
} from '@phosphor-icons/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { data: kpi, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: dashboardApi.getAdminDashboard,
  });

  const chartData = kpi?.attendanceTrend?.map((item) => ({
    date: item.date.slice(5), // MM-DD
    rate: Number(item.attendanceRate.toFixed(1)),
  })) || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
            Administrative Console
          </h1>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-1">
            Real-time university operations, live attendance analytics, and academic metrics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/academics/courses"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-800 text-apple-gray-800 dark:text-apple-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1"
          >
            Add Course <ArrowUpRight className="h-3 w-3" />
          </Link>
          <Link
            to="/notices"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-apple-blue text-white hover:bg-[#0077ed] transition flex items-center gap-1"
          >
            Post Notice <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={isLoading ? '...' : (kpi?.totalStudents?.toLocaleString() ?? 0)}
          subtitle="Enrolled active"
          icon={<Student weight="duotone" className="h-6 w-6 text-apple-blue" />}
        />
        <StatCard
          title="Faculty Members"
          value={isLoading ? '...' : (kpi?.totalFaculty ?? 0)}
          subtitle="Active faculty"
          icon={<ChalkboardTeacher weight="duotone" className="h-6 w-6 text-purple-500" />}
        />
        <StatCard
          title="Departments"
          value={isLoading ? '...' : (kpi?.totalDepartments ?? 0)}
          subtitle="Engineering & Sciences"
          icon={<Buildings weight="duotone" className="h-6 w-6 text-amber-500" />}
        />
        <StatCard
          title="Active Courses"
          value={isLoading ? '...' : (kpi?.activeCourses ?? 0)}
          subtitle="Current semester"
          icon={<BookBookmark weight="duotone" className="h-6 w-6 text-emerald-500" />}
        />
        <StatCard
          title="Pending Fees"
          value={isLoading ? '...' : (kpi?.pendingFees ?? 0)}
          subtitle="Invoices outstanding"
          icon={<Receipt weight="duotone" className="h-6 w-6 text-rose-500" />}
        />
      </div>

      {/* Attendance Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-apple-gray-900 dark:text-white">
              Campus Attendance Trend
            </h3>
            <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400 mt-0.5">
              14-day aggregated daily attendance rate across all university sessions
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-apple-blue/10 text-apple-blue dark:bg-apple-blue-dark/20 dark:text-apple-blue-dark">
            Live Metric
          </span>
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(142, 142, 147, 0.15)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8e8e93' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8e8e93' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl glass-card p-2.5 shadow-lg border border-black/5 dark:border-white/10 text-xs">
                          <p className="font-semibold text-apple-gray-900 dark:text-white">{label}</p>
                          <p className="text-apple-blue dark:text-apple-blue-dark font-medium">
                            Attendance: {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#0071e3"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-apple-gray-400">
              Loading attendance analytics...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
