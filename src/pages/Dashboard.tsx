import { Link } from 'react-router-dom';
import { Building2, Calendar, Plus, Eye, ArrowRight, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { isPast, parseISO, format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();

  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.dateFrom)));
  const nextBooking = upcomingBookings.sort((a, b) => 
    parseISO(a.dateFrom).getTime() - parseISO(b.dateFrom).getTime()
  )[0];

  if (user?.venueManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-neutral-600">Manage your venues and bookings</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link
              to="/manager/venues"
              className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-soft border border-white/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">My Venues</h3>
                  <p className="text-sm sm:text-base text-neutral-600">Manage your properties</p>
                </div>
              </div>
            </Link>

            <Link
              to="/manager/bookings"
              className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-soft border border-white/50 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-secondary-700 transition-colors">Venue Bookings</h3>
                  <p className="text-sm sm:text-base text-neutral-600">View guest bookings</p>
                </div>
              </div>
            </Link>

            <Link
              to="/manager/venues/create"
              className="group bg-gradient-to-br from-accent-500 to-accent-600 p-4 sm:p-6 rounded-2xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 text-white sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold">Add New Venue</h3>
                  <p className="text-sm sm:text-base text-accent-100">Create a new property</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-neutral-600">Plan your next adventure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Booking */}
            {nextBooking && (
              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-soft border border-white/50">
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-primary-500" />
                  Next Trip
                </h2>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {nextBooking.venue?.media?.[0] && (
                    <img
                      src={nextBooking.venue.media[0].url}
                      alt={nextBooking.venue.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 ring-2 ring-primary-200"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-neutral-900 truncate">
                      {nextBooking.venue?.name}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600">
                      {format(parseISO(nextBooking.dateFrom), 'MMM dd')} - {format(parseISO(nextBooking.dateTo), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      {nextBooking.guests} guest{nextBooking.guests !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-soft border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-primary-500" />
                  <div className="text-xs sm:text-sm text-neutral-600">Upcoming trips</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary-600">
                  {loading ? '...' : upcomingBookings.length}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-soft border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-secondary-500" />
                  <div className="text-xs sm:text-sm text-neutral-600">Total bookings</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-neutral-900">
                  {loading ? '...' : bookings.length}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900">Recent Bookings</h2>
                  <Link
                    to="/my-bookings"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    View all
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-neutral-600 mb-4">No bookings yet</p>
                  <Link
                    to="/venues"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Building2 size={16} />
                    Browse venues
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-neutral-900">
                            {booking.venue?.name || 'Unknown Venue'}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {format(parseISO(booking.dateFrom), 'MMM dd')} - {format(parseISO(booking.dateTo), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium ${
                          !isPast(parseISO(booking.dateFrom))
                            ? 'bg-success-100 text-success-800 border border-success-200'
                            : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                        }`}>
                          {!isPast(parseISO(booking.dateFrom)) ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-white/50">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/venues"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white text-center py-2.5 px-4 rounded-xl hover:scale-105 transition-all duration-200 font-medium shadow-soft"
                >
                  <Building2 size={18} />
                  Browse Venues
                </Link>
                <Link
                  to="/my-bookings"
                  className="flex items-center justify-center gap-2 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-center py-2.5 px-4 rounded-xl transition-all duration-200 font-medium"
                >
                  <Calendar size={18} />
                  View My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-center py-2.5 px-4 rounded-xl transition-all duration-200 font-medium"
                >
                  <Eye size={18} />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Become a Host */}
            {!user?.venueManager && (
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-2xl text-white shadow-soft">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Star size={20} />
                  Become a Host
                </h3>
                <p className="text-accent-100 text-sm mb-4">
                  Start earning by sharing your space with travelers
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all duration-200"
                >
                  <ArrowRight size={16} />
                  Learn More
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}