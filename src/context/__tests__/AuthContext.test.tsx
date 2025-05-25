import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { apiService } from '../../services';

// Mock the API service
vi.mock('../../services', () => ({
  apiService: {
    login: vi.fn(),
    register: vi.fn(),
    updateProfile: vi.fn()
  }
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should provide initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockUser = {
      name: 'test_user',
      email: 'test@stud.noroff.no',
      accessToken: 'mock-token',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false
    };

    const mockResponse = { data: mockUser };
    (apiService.login as any).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      return result.current.login('test@stud.noroff.no', 'password123');
    });

    expect(apiService.login).toHaveBeenCalledWith({
      email: 'test@stud.noroff.no',
      password: 'password123'
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('mock-token');
  });

  it('should handle login errors', async () => {
    const mockError = new Error('Invalid credentials');
    (apiService.login as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(act(async () => {
      return result.current.login('invalid@stud.noroff.no', 'wrongpassword');
    })).rejects.toThrow('Invalid credentials');

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle successful registration', async () => {
    const mockUser = {
      name: 'new_user',
      email: 'new@stud.noroff.no',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false
    };

    const mockResponse = { data: mockUser };
    (apiService.register as any).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        name: 'new_user',
        email: 'new@stud.noroff.no',
        password: 'password123',
        venueManager: false
      });
    });

    expect(apiService.register).toHaveBeenCalledWith({
      name: 'new_user',
      email: 'new@stud.noroff.no',
      password: 'password123',
      venueManager: false
    });

    // Note: Register doesn't automatically log in the user
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout', async () => {
    // First, set up a logged-in state
    const mockUser = {
      name: 'test_user',
      email: 'test@stud.noroff.no',
      accessToken: 'mock-token',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false
    };

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);

    // Now test logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should update profile successfully', async () => {
    const initialUser = {
      name: 'test_user',
      email: 'test@stud.noroff.no',
      accessToken: 'mock-token',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false
    };

    const updatedUser = {
      ...initialUser,
      avatar: { url: 'https://example.com/avatar.jpg', alt: 'New avatar' }
    };

    const mockResponse = { data: updatedUser };
    (apiService.updateProfile as any).mockResolvedValueOnce(mockResponse);

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(initialUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      return result.current.updateProfile({
        avatar: { url: 'https://example.com/avatar.jpg', alt: 'New avatar' }
      });
    });

    expect(apiService.updateProfile).toHaveBeenCalledWith('test_user', {
      avatar: { url: 'https://example.com/avatar.jpg', alt: 'New avatar' }
    });

    expect(result.current.user).toEqual(updatedUser);
  });

  it('should restore user from localStorage on mount', async () => {
    const mockUser = {
      name: 'test_user',
      email: 'test@stud.noroff.no',
      accessToken: 'mock-token',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false
    };

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle corrupted localStorage data', async () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', 'invalid-json');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });
});