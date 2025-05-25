import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('should render with placeholder text', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('Search venues...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Find your venue" />);
    
    expect(screen.getByPlaceholderText('Find your venue')).toBeInTheDocument();
  });

  it('should call onSearch when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, 'beach house');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('beach house');
  });

  it('should call onSearch when Enter key is pressed', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    
    await user.type(input, 'mountain cabin');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('mountain cabin');
  });

  it('should call onSearch with trimmed query', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    
    await user.type(input, '  hotel  ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('hotel');
  });

  it('should not call onSearch with empty query', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should not call onSearch with only whitespace', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should start with empty input by default', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    expect(input).toHaveValue('');
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    const button = screen.getByRole('button', { name: /search/i });
    
    expect(input).toHaveAttribute('type', 'text');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });

  it('should have proper styling classes', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    const form = screen.getByRole('search');
    expect(form).toHaveClass('flex', 'gap-2');
    
    const input = screen.getByPlaceholderText('Search venues...');
    expect(input).toHaveClass('flex-1', 'px-4', 'py-2', 'border', 'rounded-lg');
  });

  it('should show search icon on mobile', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    
    // Check for the search icon
    const searchIcon = screen.getByRole('button', { name: /search/i }).querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should prevent form submission with empty query', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should handle controlled input changes', async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search venues...');
    
    await user.type(input, 'test query');
    
    expect(input).toHaveValue('test query');
  });
});