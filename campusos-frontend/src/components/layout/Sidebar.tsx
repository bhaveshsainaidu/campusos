import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  SquaresFour,
  BookBookmark,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  Megaphone,
  Clock,
  WarningCircle,
  Buildings,
  FileText,
} from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: ('ROLE_ADMIN' | 'ROLE_FACULTY' | 'ROLE_STUDENT')[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          label: 'Dashboard',
          to: '/',
          icon: <SquaresFour weight="duotone" className="h-5 w-5" />,
        },
      ],
    },
    {
      title: 'Academics',
      items: [
        {
          label: 'Courses',
          to: '/academics/courses',
          icon: <BookBookmark weight="duotone" className="h-5 w-5" />,
        },
        {
          label: 'Departments',
          to: '/academics/departments',
          icon: <Buildings weight="duotone" className="h-5 w-5" />,
        },
        {
          label: 'Timetable',
          to: '/academics/timetable',
          icon: <Clock weight="duotone" className="h-5 w-5" />,
        },
      ],
    },
    {
      title: 'Attendance',
      items: [
        {
          label: 'Mark Attendance',
          to: '/attendance/mark',
          icon: <CalendarCheck weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_ADMIN', 'ROLE_FACULTY'],
        },
        {
          label: 'My Attendance',
          to: '/attendance/me',
          icon: <CalendarCheck weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_STUDENT'],
        },
        {
          label: 'Shortage Alerts',
          to: '/attendance/shortage',
          icon: <WarningCircle weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_ADMIN', 'ROLE_FACULTY'],
        },
      ],
    },
    {
      title: 'Examinations',
      items: [
        {
          label: 'Exam Schedule',
          to: '/exams/schedule',
          icon: <GraduationCap weight="duotone" className="h-5 w-5" />,
        },
        {
          label: 'Marks Entry',
          to: '/exams/marks',
          icon: <FileText weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_ADMIN', 'ROLE_FACULTY'],
        },
        {
          label: 'Marksheets',
          to: '/exams/marksheets',
          icon: <FileText weight="duotone" className="h-5 w-5" />,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          label: 'Fee Structures',
          to: '/fees/structures',
          icon: <CreditCard weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_ADMIN'],
        },
        {
          label: 'My Fees & Payments',
          to: '/fees/my',
          icon: <CreditCard weight="duotone" className="h-5 w-5" />,
          roles: ['ROLE_STUDENT'],
        },
      ],
    },
    {
      title: 'Communication',
      items: [
        {
          label: 'Notice Board',
          to: '/notices',
          icon: <Megaphone weight="duotone" className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-apple-gray-200/60 dark:border-apple-gray-800/60 bg-apple-gray-50/50 dark:bg-apple-gray-950/40 p-4 shrink-0 transition-colors">
      <div className="space-y-6">
        {sections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || (userRole && item.roles.includes(userRole))
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-apple-gray-400 dark:text-apple-gray-500">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-apple-blue text-white shadow-sm dark:bg-apple-blue-dark'
                          : 'text-apple-gray-600 hover:text-apple-gray-900 hover:bg-black/5 dark:text-apple-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                      )
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
