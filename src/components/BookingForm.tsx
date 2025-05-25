import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, differenceInDays } from 'date-fns';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services';
import { ApiError } from '../types';
import type { Venue, Booking } from '../types';

// Form-specific schema - only includes the field the user inputs
const createBookingFormSchema = (maxGuests: number) => z.object({
  guests: z.number().min(1, 'Must have at least 1 guest').max(maxGuests, `Cannot exceed ${maxGuests} guests`),
});

type BookingFormData = {
  guests: number;
};

interface BookingFormProps {
  venue: Venue;
  selectedDateFrom: Date | null;
  selectedDateTo: Date | null;
  onBookingSuccess?: (booking: Booking) => void;
}

export function BookingForm({ 
  venue, 
  selectedDateFrom, 
  selectedDateTo,
  onBookingSuccess 
}: BookingFormProps) {
  const { isAuthenticated, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const bookingFormSchema = createBookingFormSchema(venue.maxGuests);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: 1,
    },
  });

  const nights = selectedDateFrom && selectedDateTo 
    ? differenceInDays(selectedDateTo, selectedDateFrom)
    : 0;
  
  const totalPrice = nights * venue.price;

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      setError('Please login to make a booking');
      return;
    }

    if (!selectedDateFrom || !selectedDateTo) {
      setError('Please select check-in and check-out dates');
      return;
    }

    try {
      setError(null);
      setSuccess(false);

      const bookingData = {
        dateFrom: selectedDateFrom.toISOString(),
        dateTo: selectedDateTo.toISOString(),
        guests: data.guests,
        venueId: venue.id,
      };

      const response = await apiService.createBooking(bookingData);
      setSuccess(true);
      
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create booking');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Book This Venue</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Please login to make a booking
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login to Book
          </a>
        </div>
      </div>
    );
  }

  if (user?.venueManager && venue.owner?.name === user.name) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Your Venue</h3>
        <p className="text-gray-600">
          This is your venue. You can manage bookings from your dashboard.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-green-600 mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-4">
            Your booking has been successfully created.
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Book This Venue</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <input
              type="text"
              value={selectedDateFrom ? format(selectedDateFrom, 'MMM dd, yyyy') : ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Select date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <input
              type="text"
              value={selectedDateTo ? format(selectedDateTo, 'MMM dd, yyyy') : ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Select date"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Number of guests
          </label>
          <select
            {...register('guests', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: venue.maxGuests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} guest{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="mt-1 text-sm text-red-600">{errors.guests.message as string}</p>
          )}
        </div>

        {selectedDateFrom && selectedDateTo && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                ${venue.price} × {nights} night{nights !== 1 ? 's' : ''}
              </span>
              <span className="text-sm text-gray-900">
                ${venue.price * nights}
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !selectedDateFrom || !selectedDateTo}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}