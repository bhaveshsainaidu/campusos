import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout & Guards
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';

// Academics
import { CoursesPage } from './pages/academics/CoursesPage';
import { DepartmentsPage } from './pages/academics/DepartmentsPage';
import { TimetablePage } from './pages/academics/TimetablePage';

// Attendance
import { MarkAttendancePage } from './pages/attendance/MarkAttendancePage';
import { StudentAttendancePage } from './pages/attendance/StudentAttendancePage';
import { ShortageAlertsPage } from './pages/attendance/ShortageAlertsPage';

// Exams
import { ExamSchedulePage } from './pages/exams/ExamSchedulePage';
import { MarksEntryPage } from './pages/exams/MarksEntryPage';
import { MarksheetsPage } from './pages/exams/MarksheetsPage';

// Fees
import { FeeStructuresPage } from './pages/fees/FeeStructuresPage';
import { StudentFeesPage } from './pages/fees/StudentFeesPage';

// Notices
import { NoticesPage } from './pages/notices/NoticesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Workspace */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRouter />} />

        {/* Academics */}
        <Route path="academics/courses" element={<CoursesPage />} />
        <Route path="academics/departments" element={<DepartmentsPage />} />
        <Route path="academics/timetable" element={<TimetablePage />} />

        {/* Attendance */}
        <Route
          path="attendance/mark"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_FACULTY']}>
              <MarkAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="attendance/me"
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <StudentAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="attendance/shortage"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_FACULTY']}>
              <ShortageAlertsPage />
            </ProtectedRoute>
          }
        />

        {/* Exams */}
        <Route path="exams/schedule" element={<ExamSchedulePage />} />
        <Route
          path="exams/marks"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_FACULTY']}>
              <MarksEntryPage />
            </ProtectedRoute>
          }
        />
        <Route path="exams/marksheets" element={<MarksheetsPage />} />

        {/* Fees */}
        <Route
          path="fees/structures"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <FeeStructuresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="fees/my"
          element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <StudentFeesPage />
            </ProtectedRoute>
          }
        />

        {/* Notices */}
        <Route path="notices" element={<NoticesPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
