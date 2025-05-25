import { Link } from 'react-router-dom';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import { LoadingCard, ErrorMessage } from '../components/ui';
import { useVenues } from '../hooks';

export default function Home() {
  const { venues, loading, error, refetch } = useVenues({ limit: 6 });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Find Your Perfect Getaway
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto">
            Discover unique accommodations around the world
          </p>
          
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <SearchBar />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              to="/venues"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Browse All Venues
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Venues
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover some of our most popular accommodations
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage
              title="Failed to load featured venues"
              message={error}
              onRetry={refetch}
              className="max-w-md mx-auto"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
              
              <div className="text-center mt-8 sm:mt-12">
                <Link
                  to="/venues"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  View All Venues
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Holidaze?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Properties</h3>
              <p className="text-gray-600">
                Stay in handpicked accommodations that offer something special
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All venues are verified and rated by our community
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}