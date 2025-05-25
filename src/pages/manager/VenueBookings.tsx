import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import type { Venue, Booking } from '../../types/api';
import { format, parseISO, isPast } from 'date-fns';
import {
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Mail,
  Star,
} from 'lucide-react';

export default function VenueBookings() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await apiService.getVenues();
        const venuesData = response.data;

        // Filter venues owned by current user and fetch their bookings
        const myVenues = venuesData.filter(
          (venue: Venue) => venue.owner?.email === user?.email,
        );

        // Fetch detailed venue data with bookings
        const venuesWithBookings = await Promise.all(
          myVenues.map(async (venue: Venue) => {
            try {
              const response = await apiService.getVenue(venue.id);
              return response.data;
            } catch (error) {
              console.error(`Error fetching venue ${venue.id}:`, error);
              return venue;
            }
          }),
        );

        setVenues(venuesWithBookings);
      } catch (error) {
        console.error('Error fetching venue bookings:', error);
        setError('Failed to load venue bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueBookings();
  }, [user?.email]);

  const getBookingStatus = (booking: Booking) => {
    const now = new Date();
    const checkIn = parseISO(booking.dateFrom);
    const checkOut = parseISO(booking.dateTo);

    if (isPast(checkOut)) {
      return {
        status: 'completed',
        label: 'Completed',
        color: 'bg-gray-100 text-gray-800',
      };
    } else if (now >= checkIn && now <= checkOut) {
      return {
        status: 'active',
        label: 'Active',
        color: 'bg-green-100 text-green-800',
      };
    } else {
      return {
        status: 'upcoming',
        label: 'Upcoming',
        color: 'bg-blue-100 text-blue-800',
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft"
              >
                <div className="h-6 bg-primary-100 rounded-2xl w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-primary-50 rounded-2xl w-2/3"></div>
                  <div className="h-4 bg-primary-50 rounded-2xl w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50/80 backdrop-blur-lg border border-red-200 rounded-3xl p-6 shadow-soft">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const allBookings = venues.flatMap((venue) =>
    (venue.bookings || []).map((booking) => ({ ...booking, venue })),
  );

  const sortedBookings = allBookings.sort(
    (a, b) => parseISO(b.created).getTime() - parseISO(a.created).getTime(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">
            Venue Bookings
          </h1>
          <p className="text-neutral-600 mt-1 flex items-center gap-2">
            <Calendar size={16} className="text-primary-500" />
            Manage bookings for your venues
          </p>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 p-12 text-center">
            <div className="mb-6">
              <Building2 size={64} className="text-primary-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No venues yet
            </h2>
            <p className="text-neutral-600">
              Create a venue to start receiving bookings
            </p>
          </div>
        ) : allBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 p-12 text-center">
            <div className="mb-6">
              <Calendar size={64} className="text-primary-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              No bookings yet
            </h2>
            <p className="text-neutral-600">
              Your venues haven't received any bookings yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-3xl shadow-soft text-white">
                <div className="flex items-center justify-between mb-2">
                  <Clock size={24} className="text-white/80" />
                  <div className="text-2xl font-bold">
                    {
                      allBookings.filter(
                        (b) => getBookingStatus(b).status === 'upcoming',
                      ).length
                    }
                  </div>
                </div>
                <div className="text-white/90 font-medium">
                  Upcoming Bookings
                </div>
              </div>
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-6 rounded-3xl shadow-soft text-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp size={24} className="text-white/80" />
                  <div className="text-2xl font-bold">
                    {
                      allBookings.filter(
                        (b) => getBookingStatus(b).status === 'active',
                      ).length
                    }
                  </div>
                </div>
                <div className="text-white/90 font-medium">Active Bookings</div>
              </div>
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-3xl shadow-soft text-white">
                <div className="flex items-center justify-between mb-2">
                  <Calendar size={24} className="text-white/80" />
                  <div className="text-2xl font-bold">{allBookings.length}</div>
                </div>
                <div className="text-white/90 font-medium">Total Bookings</div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold text-neutral-800">
                  All Bookings
                </h2>
              </div>

              <div className="divide-y divide-white/20">
                {sortedBookings.map((booking) => {
                  const bookingStatus = getBookingStatus(booking);

                  return (
                    <div
                      key={booking.id}
                      className="p-6 hover:bg-white/40 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
                              <Building2
                                size={16}
                                className="text-primary-500"
                              />
                              {booking.venue.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bookingStatus.color}`}
                            >
                              {bookingStatus.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-primary-500" />
                              <span className="font-medium">Guest:</span>{' '}
                              {booking.customer?.name || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-primary-500" />
                              <span className="font-medium">Email:</span>{' '}
                              {booking.customer?.email || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-primary-500" />
                              <span className="font-medium">Guests:</span>{' '}
                              {booking.guests}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar
                                size={14}
                                className="text-primary-500"
                              />
                              <span className="font-medium">Dates:</span>{' '}
                              {format(parseISO(booking.dateFrom), 'MMM dd')} -{' '}
                              {format(parseISO(booking.dateTo), 'MMM dd, yyyy')}
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-neutral-500 flex items-center gap-2">
                            <Clock size={14} className="text-primary-400" />
                            Booked on{' '}
                            {format(parseISO(booking.created), 'MMM dd, yyyy')}
                          </div>
                        </div>

                        <div className="ml-6 text-right">
                          <div className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            ${booking.venue.price * booking.guests}/night
                          </div>
                          <div className="text-sm text-neutral-500">
                            {booking.guests} guest
                            {booking.guests !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
