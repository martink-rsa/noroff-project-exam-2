import { Link } from 'react-router-dom';
import { Building2, Star, Calendar, ArrowRight } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import { LoadingCard, ErrorMessage } from '../components/ui';
import { useVenues } from '../hooks';

export default function Home() {
  const { venues, loading, error, refetch } = useVenues({ limit: 6 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1676667573156-7d14e8b79ad3?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Beautiful vacation destination with modern accommodations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 via-secondary-500/70 to-accent-400/60"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 sm:mb-6 text-white drop-shadow-lg">
            Find Your Perfect Getaway
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/95 max-w-3xl mx-auto drop-shadow-md">
            Discover unique accommodations around the world with Holidaze
          </p>

          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              to="/venues"
              className="inline-flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-primary-700 px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-200 shadow-soft hover:shadow-lg"
            >
              <Building2 size={20} />
              Browse All Venues
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-white/20 backdrop-blur-sm transition-all duration-200 shadow-soft"
            >
              <Star size={20} />
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-primary-50/50 to-secondary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 mb-3 sm:mb-4">
              Featured Venues
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover some of our most popular accommodations
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-neutral-900 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-soft hover:shadow-soft-lg"
                >
                  <Building2 size={20} />
                  View All Venues
                  <ArrowRight size={16} />
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
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 mb-4">
              Why Choose Holidaze?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 hover:shadow-soft-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-primary-400 to-primary-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} className="text-neutral-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                Unique Properties
              </h3>
              <p className="text-neutral-600">
                Stay in handpicked accommodations that offer something special
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 hover:shadow-soft-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-secondary-400 to-secondary-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-neutral-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                Quality Guaranteed
              </h3>
              <p className="text-neutral-600">
                All venues are verified and rated by our community
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 hover:shadow-soft-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-accent-400 to-accent-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-neutral-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                Easy Booking
              </h3>
              <p className="text-neutral-600">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
