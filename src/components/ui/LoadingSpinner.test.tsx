import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default medium size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.firstChild;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render with small size', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('should render with large size', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('should apply correct CSS classes for animation', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('border-2');
    expect(spinner).toHaveClass('border-gray-300');
    expect(spinner).toHaveClass('border-t-blue-600');
  });

  it('should accept custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('custom-class');
  });
});