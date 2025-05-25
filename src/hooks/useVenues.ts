import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import type { Venue } from '../types';
import { ApiError } from '../types';

interface UseVenuesOptions {
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseVenuesReturn {
  venues: Venue[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVenues(options: UseVenuesOptions = {}): UseVenuesReturn {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract individual options to avoid object reference issues
  const { limit, sort, sortOrder } = options;

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVenues({ limit, sort, sortOrder });
      setVenues(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load venues');
      }
    } finally {
      setLoading(false);
    }
  }, [limit, sort, sortOrder]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return {
    venues,
    loading,
    error,
    refetch: fetchVenues,
  };
}