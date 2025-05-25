import { Link } from 'react-router-dom';
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">Manage your venues and bookings</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link
              to="/manager/venues"
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🏠</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Venues</h3>
                  <p className="text-sm sm:text-base text-gray-600">Manage your properties</p>
                </div>
              </div>
            </Link>

            <Link
              to="/manager/bookings"
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">📅</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Venue Bookings</h3>
                  <p className="text-sm sm:text-base text-gray-600">View guest bookings</p>
                </div>
              </div>
            </Link>

            <Link
              to="/manager/venues/create"
              className="bg-blue-600 p-4 sm:p-6 rounded-lg shadow-sm border border-blue-600 hover:bg-blue-700 transition-colors text-white sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">➕</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold">Add New Venue</h3>
                  <p className="text-sm sm:text-base text-blue-100">Create a new property</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Plan your next adventure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Booking */}
            {nextBooking && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Next Trip</h2>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {nextBooking.venue?.media?.[0] && (
                    <img
                      src={nextBooking.venue.media[0].url}
                      alt={nextBooking.venue.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {nextBooking.venue?.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {format(parseISO(nextBooking.dateFrom), 'MMM dd')} - {format(parseISO(nextBooking.dateTo), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {nextBooking.guests} guest{nextBooking.guests !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {loading ? '...' : upcomingBookings.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Upcoming trips</div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {loading ? '...' : bookings.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total bookings</div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                  <Link
                    to="/my-bookings"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-4">No bookings yet</p>
                  <Link
                    to="/venues"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Browse venues →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.venue?.name || 'Unknown Venue'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(booking.dateFrom), 'MMM dd')} - {format(parseISO(booking.dateTo), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !isPast(parseISO(booking.dateFrom))
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/venues"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Venues
                </Link>
                <Link
                  to="/my-bookings"
                  className="block w-full bg-gray-100 text-gray-900 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  View My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="block w-full bg-gray-100 text-gray-900 text-center py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Become a Host */}
            {!user?.venueManager && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Become a Host</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Start earning by sharing your space with travelers
                </p>
                <Link
                  to="/register"
                  className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
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