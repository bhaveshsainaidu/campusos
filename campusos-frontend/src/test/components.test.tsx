import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';

describe('Common UI Components', () => {
  it('Button renders text and responds to click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Button disables and shows spinner when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('Badge renders different semantic variants', () => {
    const { rerender } = render(<Badge variant="success">Passed</Badge>);
    expect(screen.getByText('Passed')).toHaveClass('text-emerald-700');

    rerender(<Badge variant="danger">Failed</Badge>);
    expect(screen.getByText('Failed')).toHaveClass('text-rose-700');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('text-amber-700');
  });

  it('Card renders children with glassmorphic classes', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toHaveClass('glass-card');
  });

  it('Modal renders content when isOpen=true and does not render when isOpen=false', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={false} onClose={handleClose} title="Test Modal">
        <p>Modal Body</p>
      </Modal>
    );

    expect(screen.queryByText('Modal Body')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal Body</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Body')).toBeInTheDocument();
  });
});
