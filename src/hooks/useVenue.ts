import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services';
import type { Venue } from '../types';
import { ApiError } from '../types';

interface UseVenueReturn {
  venue: Venue | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVenue(id: string): UseVenueReturn {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVenue(id);
      setVenue(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load venue');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVenue();
    }
  }, [id, fetchVenue]);

  return {
    venue,
    loading,
    error,
    refetch: fetchVenue,
  };
}