import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { DashboardRouter } from '../pages/dashboard/DashboardRouter';

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DashboardRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Router', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: 'fake-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('renders Administrative Console for ROLE_ADMIN', () => {
    useAuthStore.setState({
      user: {
        id: 1,
        email: 'admin@campusos.edu',
        role: 'ROLE_ADMIN',
        fullName: 'Admin User',
        active: true,
      },
    });

    renderDashboard();
    expect(screen.getByText('Administrative Console')).toBeInTheDocument();
  });

  it('renders Faculty Command Center for ROLE_FACULTY', () => {
    useAuthStore.setState({
      user: {
        id: 2,
        email: 'faculty1@campusos.edu',
        role: 'ROLE_FACULTY',
        fullName: 'Prof. Turing',
        active: true,
      },
    });

    renderDashboard();
    expect(screen.getByText('Faculty Command Center')).toBeInTheDocument();
  });

  it('renders Student Workspace for ROLE_STUDENT', () => {
    useAuthStore.setState({
      user: {
        id: 3,
        email: 'student00001@campusos.edu',
        role: 'ROLE_STUDENT',
        fullName: 'Aarav Sharma',
        active: true,
      },
    });

    renderDashboard();
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText('Academic Standing')).toBeInTheDocument();
  });
});
