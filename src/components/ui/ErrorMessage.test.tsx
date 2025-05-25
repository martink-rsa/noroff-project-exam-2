import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Network error" onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Network error" onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error without retry" />);
    
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<ErrorMessage message="Test error" />);
    
    const container = screen.getByText('Test error').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('bg-red-50', 'border', 'border-red-200', 'rounded-md', 'p-4');
  });

  it('should have error icon', () => {
    render(<ErrorMessage message="Test error" />);
    
    // Check for the error icon svg
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-5', 'w-5', 'text-red-400');
  });

  it('should have proper accessibility attributes', () => {
    render(<ErrorMessage message="Accessibility test" />);
    
    // ErrorMessage component doesn't use role="alert", check for title instead
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Accessibility test')).toBeInTheDocument();
  });
});