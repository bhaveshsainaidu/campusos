import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { LoginPage } from '../pages/auth/LoginPage';

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication and Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('updates store state on setAuth and clears on logout', () => {
    const store = useAuthStore.getState();

    store.setAuth({
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 1,
        email: 'admin@campusos.edu',
        role: 'ROLE_ADMIN',
        fullName: 'Admin User',
        active: true,
      },
    });

    const updated = useAuthStore.getState();
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.user?.email).toBe('admin@campusos.edu');
    expect(updated.user?.role).toBe('ROLE_ADMIN');

    // Test logout
    updated.logout();
    const loggedOut = useAuthStore.getState();
    expect(loggedOut.isAuthenticated).toBe(false);
    expect(loggedOut.user).toBeNull();
  });

  it('LoginPage renders email and password fields and demo pills', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByPlaceholderText(/admin@campusos.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

    // Verify demo credential pills
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Faculty')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();

    // Click Student demo pill
    const studentPill = screen.getByText('Student');
    fireEvent.click(studentPill);

    const emailInput = screen.getByPlaceholderText(/admin@campusos.edu/i) as HTMLInputElement;
    expect(emailInput.value).toBe('student00001@campusos.edu');
  });
});
