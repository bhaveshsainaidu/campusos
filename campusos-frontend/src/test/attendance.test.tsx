import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShortageAlertsPage } from '../pages/attendance/ShortageAlertsPage';

describe('Attendance Shortage Registry', () => {
  it('renders Shortage Registry page with cutoff options', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ShortageAlertsPage />
      </QueryClientProvider>
    );

    expect(screen.getByText('Attendance Shortage Registry')).toBeInTheDocument();
    expect(screen.getByText(/Students at Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/< 75% \(Mandatory\)/i)).toBeInTheDocument();
  });
});
