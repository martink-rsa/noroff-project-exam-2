import { useState, useEffect } from 'react';
import { apiService } from '../services';
import type { Booking } from '../types';
import { ApiError } from '../types';

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

export function useBookings(): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBookings();
      setBookings(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await apiService.deleteBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete booking');
      }
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    deleteBooking,
  };
}