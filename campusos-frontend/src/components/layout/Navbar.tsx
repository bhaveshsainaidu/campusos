import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  SunDim,
  MoonStars,
  Bell,
  SignOut,
  User as UserIcon,
} from '@phosphor-icons/react';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { unreadNoticesCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_FACULTY':
        return 'Faculty';
      case 'ROLE_STUDENT':
        return 'Student';
      default:
        return 'Member';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 glass border-b border-apple-gray-200/60 dark:border-apple-gray-800/60 px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-apple-gray-900 dark:text-white">
              CampusOS
            </span>
            <span className="text-[10px] text-apple-gray-500 font-medium tracking-wider uppercase">
              Academic Cloud
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Notices Bell */}
        <Link
          to="/notices"
          className="relative p-2 rounded-xl text-apple-gray-600 dark:text-apple-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
          title="Campus Announcements"
        >
          <Bell weight="duotone" className="h-5 w-5" />
          {unreadNoticesCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-apple-blue text-[10px] font-bold text-white">
              {unreadNoticesCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-apple-gray-600 dark:text-apple-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
          title="Toggle Light/Dark Theme"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <SunDim weight="duotone" className="h-5 w-5 text-amber-400" />
          ) : (
            <MoonStars weight="duotone" className="h-5 w-5 text-apple-gray-700" />
          )}
        </button>

        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-apple-gray-200 dark:border-apple-gray-800">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-apple-gray-900 dark:text-white">
                {user.fullName || user.email}
              </span>
              <Badge variant="info" size="sm" className="mt-0.5">
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <div className="w-8 h-8 rounded-full bg-apple-gray-200 dark:bg-apple-gray-700 flex items-center justify-center text-apple-gray-700 dark:text-apple-gray-200 font-medium text-xs">
              <UserIcon weight="duotone" className="h-4 w-4" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Logout"
            >
              <SignOut weight="duotone" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
