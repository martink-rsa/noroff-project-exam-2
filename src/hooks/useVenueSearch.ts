import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import type { Venue, PaginationMeta } from '../types';
import { ApiError } from '../types';

interface UseVenueSearchOptions {
  initialQuery?: string;
  limit?: number;
}

interface UseVenueSearchReturn {
  venues: Venue[];
  loading: boolean;
  error: string | null;
  query: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: (searchQuery: string) => Promise<void>;
  setPage: (page: number) => void;
  goToPage: (page: number) => Promise<void>;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => Promise<void>;
  clearSearch: () => void;
  refetch: () => Promise<void>;
}

export function useVenueSearch({ 
  initialQuery = '', 
  limit = 12 
}: UseVenueSearchOptions = {}): UseVenueSearchReturn {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchVenues = useCallback(async (searchQuery: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchQuery.trim()) {
        response = await apiService.searchVenues(searchQuery.trim());
      } else {
        response = await apiService.getVenues({
          page,
          limit,
          sort: sortBy,
          sortOrder,
        });
      }
      
      setVenues(response.data);
      setMeta(response.meta || null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load venues');
      }
    } finally {
      setLoading(false);
    }
  }, [limit, sortBy, sortOrder]);

  const search = async (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    await fetchVenues(searchQuery, 1);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
    fetchVenues(query, page);
  };

  const goToPage = async (page: number) => {
    setCurrentPage(page);
    await fetchVenues(query, page);
  };

  const setSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const setSorting = async (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    await fetchVenues(query, 1);
  };

  const clearSearch = () => {
    setQuery('');
    setVenues([]);
    setCurrentPage(1);
    setError(null);
  };

  const refetch = () => fetchVenues(query, currentPage);

  useEffect(() => {
    fetchVenues(query, currentPage);
  }, [fetchVenues, query, currentPage]);

  return {
    venues,
    loading,
    error,
    query,
    currentPage,
    totalPages: meta?.pageCount || 1,
    totalCount: meta?.totalCount || 0,
    sortBy,
    sortOrder,
    search,
    setPage,
    goToPage,
    setSort,
    setSorting,
    clearSearch,
    refetch,
  };
}