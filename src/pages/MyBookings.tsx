import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import { useBookings } from '../hooks/useBookings';
import { isPast, parseISO } from 'date-fns';
import { Calendar, Clock, Archive, MapPin } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">My Bookings</h1>
          <p className="text-neutral-600 flex items-center gap-2">
            <Calendar size={16} className="text-primary-500" />
            View and manage your accommodation bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-lg border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 shadow-soft">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft'
                : 'text-neutral-600 hover:text-neutral-800 bg-white/80 backdrop-blur-lg hover:bg-white/90 border border-white/20'
            }`}
          >
            <Calendar size={16} />
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft'
                : 'text-neutral-600 hover:text-neutral-800 bg-white/80 backdrop-blur-lg hover:bg-white/90 border border-white/20'
            }`}
          >
            <Clock size={16} />
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 ${
              filter === 'past'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft'
                : 'text-neutral-600 hover:text-neutral-800 bg-white/80 backdrop-blur-lg hover:bg-white/90 border border-white/20'
            }`}
          >
            <Archive size={16} />
            Past ({pastCount})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 text-center py-16">
            <div className="mb-6">
              <Calendar size={64} className="text-primary-300 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              {filter === 'all' 
                ? 'No bookings yet' 
                : `No ${filter} bookings`}
            </h3>
            <p className="text-neutral-600 mb-8">
              {filter === 'all' 
                ? 'Start planning your next trip by browsing available venues.'
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link
              to="/venues"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 inline-flex items-center gap-3"
            >
              <MapPin size={18} />
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