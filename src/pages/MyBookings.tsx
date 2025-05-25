import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingCard } from '../components/BookingCard';
import { useBookings } from '../hooks/useBookings';
import { isPast, parseISO } from 'date-fns';

export default function MyBookings() {
  const { bookings, loading, error, deleteBooking } = useBookings();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filteredBookings = bookings.filter(booking => {
    const checkInDate = parseISO(booking.dateFrom);
    const isUpcoming = !isPast(checkInDate);
    
    switch (filter) {
      case 'upcoming':
        return isUpcoming;
      case 'past':
        return !isUpcoming;
      default:
        return true;
    }
  });

  const upcomingCount = bookings.filter(b => !isPast(parseISO(b.dateFrom))).length;
  const pastCount = bookings.filter(b => isPast(parseISO(b.dateFrom))).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">
            View and manage your accommodation bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Past ({pastCount})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' 
                ? 'No bookings yet' 
                : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start planning your next trip by browsing available venues.'
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link
              to="/venues"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Venues
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={deleteBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}