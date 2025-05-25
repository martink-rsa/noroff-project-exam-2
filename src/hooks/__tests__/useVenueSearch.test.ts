import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVenueSearch } from '../useVenueSearch';
import { apiService } from '../../services';

// Mock the API service
vi.mock('../../services', () => ({
  apiService: {
    getVenues: vi.fn()
  }
}));

describe('useVenueSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVenuesResponse = {
    data: [
      {
        id: '1',
        name: 'Beach House',
        description: 'Beautiful beach house',
        media: [],
        price: 200,
        maxGuests: 6,
        rating: 4.8,
        created: '2024-01-01',
        updated: '2024-01-01',
        meta: {
          wifi: true,
          parking: true,
          breakfast: false,
          pets: true
        },
        location: {
          address: 'Beach Road',
          city: 'Coastal City',
          zip: '12345',
          country: 'Norway',
          continent: 'Europe',
          lat: 60.0,
          lng: 10.0
        },
        owner: {
          name: 'owner',
          email: 'owner@stud.noroff.no',
          avatar: { url: '', alt: '' },
          banner: { url: '', alt: '' }
        },
        bookings: [],
        _count: { bookings: 5 }
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

  it('should initialize with empty search results', () => {
    const { result } = renderHook(() => useVenueSearch());

    expect(result.current.venues).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.query).toBe('');
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.sortBy).toBe('created');
    expect(result.current.sortOrder).toBe('desc');
  });

  it('should search venues successfully', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const { result } = renderHook(() => useVenueSearch());

    await act(async () => {
      await result.current.search('beach');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.venues).toEqual(mockVenuesResponse.data);
    expect(result.current.query).toBe('beach');
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPages).toBe(1);

    expect(apiService.getVenues).toHaveBeenCalledWith({
      limit: 12,
      page: 1,
      sort: 'created',
      sortOrder: 'desc',
      search: 'beach'
    });
  });

  it('should handle search with empty query', async () => {
    (apiService.getVenues as any).mockResolvedValueOnce(mockVenuesResponse);

    const { result } = renderHook(() => useVenueSearch());

    await act(async () => {
      await result.current.search('');
    });

    expect(apiService.getVenues).toHaveBeenCalledWith({
      limit: 12,
      page: 1,
      sort: 'created',
      sortOrder: 'desc'
    });
  });

  it('should set loading state during search', async () => {
    let resolveSearch: (value: any) => void;
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve;
    });
    (apiService.getVenues as any).mockReturnValueOnce(searchPromise);

    const { result } = renderHook(() => useVenueSearch());

    // Start search
    act(() => {
      result.current.search('hotel');
    });

    // Should be loading
    expect(result.current.loading).toBe(true);

    // Resolve the search
    resolveSearch!(mockVenuesResponse);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle search errors', async () => {
    const mockError = new Error('Search failed');
    (apiService.getVenues as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useVenueSearch());

    await act(async () => {
      await result.current.search('error');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.venues).toEqual([]);
  });

  it('should change page successfully', async () => {
    (apiService.getVenues as any).mockResolvedValue(mockVenuesResponse);

    const { result } = renderHook(() => useVenueSearch());

    // First search
    await act(async () => {
      await result.current.search('hotel');
    });

    expect(result.current.currentPage).toBe(1);

    // Change to page 2
    await act(async () => {
      await result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(apiService.getVenues).toHaveBeenLastCalledWith({
      limit: 12,
      page: 2,
      sort: 'created',
      sortOrder: 'desc',
      search: 'hotel'
    });
  });

  it('should sort venues successfully', async () => {
    (apiService.getVenues as any).mockResolvedValue(mockVenuesResponse);

    const { result } = renderHook(() => useVenueSearch());

    // First search
    await act(async () => {
      await result.current.search('hotel');
    });

    // Change sort
    await act(async () => {
      await result.current.setSorting('price', 'asc');
    });

    expect(result.current.sortBy).toBe('price');
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.currentPage).toBe(1); // Should reset to page 1

    expect(apiService.getVenues).toHaveBeenLastCalledWith({
      limit: 12,
      page: 1,
      sort: 'price',
      sortOrder: 'asc',
      search: 'hotel'
    });
  });

  it('should clear search results', () => {
    const { result } = renderHook(() => useVenueSearch());

    // Set some initial state
    act(() => {
      result.current.search('test');
    });

    // Clear search
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.venues).toEqual([]);
    expect(result.current.query).toBe('');
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should calculate total pages correctly', async () => {
    const mockResponseWithPagination = {
      ...mockVenuesResponse,
      meta: {
        ...mockVenuesResponse.meta,
        totalCount: 25,
        pageCount: 3
      }
    };

    (apiService.getVenues as any).mockResolvedValueOnce(mockResponseWithPagination);

    const { result } = renderHook(() => useVenueSearch());

    await act(async () => {
      await result.current.search('hotel');
    });

    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(25);
  });

  it('should preserve search query when changing pages or sorting', async () => {
    (apiService.getVenues as any).mockResolvedValue(mockVenuesResponse);

    const { result } = renderHook(() => useVenueSearch());

    // Initial search
    await act(async () => {
      await result.current.search('beach house');
    });

    expect(result.current.query).toBe('beach house');

    // Change page - should preserve query
    await act(async () => {
      await result.current.goToPage(2);
    });

    expect(result.current.query).toBe('beach house');
    expect(apiService.getVenues).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'beach house' })
    );

    // Change sorting - should preserve query
    await act(async () => {
      await result.current.setSorting('name', 'asc');
    });

    expect(result.current.query).toBe('beach house');
    expect(apiService.getVenues).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'beach house' })
    );
  });

  it('should handle concurrent searches correctly', async () => {
    const { result } = renderHook(() => useVenueSearch());

    // Mock two different responses
    const firstResponse = { ...mockVenuesResponse };
    const secondResponse = {
      ...mockVenuesResponse,
      data: [{ ...mockVenuesResponse.data[0], name: 'Hotel Suite' }]
    };

    (apiService.getVenues as any)
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    // Start first search
    await act(async () => {
      await result.current.search('beach');
    });

    // Start second search
    await act(async () => {
      await result.current.search('hotel');
    });

    // Should have the result from the second search
    expect(result.current.query).toBe('hotel');
    expect(result.current.venues[0].name).toBe('Hotel Suite');
  });
});