import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVenues } from '../useVenues';
import { apiService } from '../../services';

// Mock the API service
vi.mock('../../services', () => ({
  apiService: {
    getVenues: vi.fn()
  }
}));

describe('useVenues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVenuesResponse = {
    data: [
      {
        id: '1',
        name: 'Test Venue 1',
        description: 'A test venue',
        media: [],
        price: 100,
        maxGuests: 4,
        rating: 4.5,
        created: '2024-01-01',
        updated: '2024-01-01',
        meta: {
          wifi: true,
          parking: false,
          breakfast: true,
          pets: false
        },
        location: {
          address: 'Test Address',
          city: 'Test City',
          zip: '12345',
          country: 'Test Country',
          continent: 'Test Continent',
          lat: 0,
          lng: 0
        },
        owner: {
          name: 'owner',
          email: 'owner@stud.noroff.no',
          avatar: { url: '', alt: '' },
          banner: { url: '', alt: '' }
        },
        bookings: [],
        _count: { bookings: 0 }
      }
    ],
    meta: {
      isFirstPage: true,
      isLastPage: true,
      currentPage: 1,
      previousPage: null,
      nextPage: null,
      pageCount: 1,
      totalCount: 1
    }
  };

  it('should fetch venues successfully', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const { result } = renderHook(() => useVenues());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.venues).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.venues).toEqual(mockVenuesResponse.data);
    expect(result.current.error).toBeNull();
    expect(apiService.getVenues).toHaveBeenCalledWith({});
  });

  it('should fetch venues with custom options', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const options = {
      limit: 10,
      page: 2,
      sort: 'name' as const,
      sortOrder: 'asc' as const
    };

    const { result } = renderHook(() => useVenues(options));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiService.getVenues).toHaveBeenCalledWith(options);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('Failed to fetch venues');
    (apiService.getVenues as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useVenues());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.venues).toEqual([]);
    expect(result.current.error).toBe('Failed to load venues');
  });

  it('should refetch venues when refetch is called', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const { result } = renderHook(() => useVenues());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiService.getVenues).toHaveBeenCalledTimes(1);

    // Mock second call
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(apiService.getVenues).toHaveBeenCalledTimes(2);
    });
  });

  it('should update loading state during refetch', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const { result } = renderHook(() => useVenues());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock delayed response for refetch
    let resolveRefetch: (value: any) => void;
    const refetchPromise = new Promise((resolve) => {
      resolveRefetch = resolve;
    });
    (apiService.getVenues as any).mockReturnValueOnce(refetchPromise);

    // Start refetch
    result.current.refetch();

    // Should be loading during refetch
    expect(result.current.loading).toBe(true);

    // Resolve the refetch
    resolveRefetch!(mockVenuesResponse);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should not fetch venues again if options have not changed', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const options = { limit: 10 };
    const { rerender } = renderHook(
      ({ opts }) => useVenues(opts),
      { initialProps: { opts: options } }
    );

    await waitFor(() => {
      expect(apiService.getVenues).toHaveBeenCalledTimes(1);
    });

    // Rerender with same options
    rerender({ opts: options });

    // Wait a bit to ensure no additional calls
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(apiService.getVenues).toHaveBeenCalledTimes(1);
  });

  it('should fetch venues again if options change', async () => {
    (apiService.getVenues as any).mockResolvedValue(mockVenuesResponse);

    const { result, rerender } = renderHook(
      ({ opts }) => useVenues(opts),
      { initialProps: { opts: { limit: 10 } } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiService.getVenues).toHaveBeenCalledTimes(1);
    expect(apiService.getVenues).toHaveBeenCalledWith({ limit: 10 });

    // Change options
    rerender({ opts: { limit: 20 } });

    await waitFor(() => {
      expect(apiService.getVenues).toHaveBeenCalledTimes(2);
    });

    expect(apiService.getVenues).toHaveBeenLastCalledWith({ limit: 20 });
  });

  it('should clear error when refetching successfully', async () => {
    // First call fails
    const mockError = new Error('Network error');
    (apiService.getVenues as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useVenues());

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load venues');
    });

    // Second call succeeds
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
    
    expect(result.current.venues).toEqual(mockVenuesResponse.data);
  });
});