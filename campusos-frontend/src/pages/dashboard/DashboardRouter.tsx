import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { StudentDashboard } from './StudentDashboard';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'ROLE_ADMIN':
      return <AdminDashboard />;
    case 'ROLE_FACULTY':
      return <FacultyDashboard />;
    case 'ROLE_STUDENT':
      return <StudentDashboard />;
    default:
      return <AdminDashboard />;
  }
};
