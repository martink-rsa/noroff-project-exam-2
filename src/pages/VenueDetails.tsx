import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  PawPrint,
  Building2,
  DollarSign,
  Calendar as CalendarIcon,
  User,
  UserCheck,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { Calendar } from '../components/Calendar';
import { BookingForm } from '../components/BookingForm';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import { useVenue } from '../hooks';

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const { venue, loading, error } = useVenue(id!);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDateSelect = (date: Date) => {
    if (!selectedDateFrom || (selectedDateFrom && selectedDateTo)) {
      // Start new selection
      setSelectedDateFrom(date);
      setSelectedDateTo(null);
    } else if (date > selectedDateFrom) {
      // Set end date
      setSelectedDateTo(date);
    } else {
      // Set new start date
      setSelectedDateFrom(date);
      setSelectedDateTo(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <p className="text-neutral-700 font-medium">
            Loading venue details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-error-50 to-warning-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Venue Not Found"
            message={error || 'The venue you are looking for does not exist.'}
            className="mb-6"
          />
          <div className="text-center">
            <Link
              to="/venues"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-neutral-900 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-soft hover:shadow-soft-lg"
            >
              <Building2 size={20} />
              Browse All Venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = venue.media || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 to-secondary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-soft">
            <Link
              to="/venues"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Venues
            </Link>
            <span className="text-neutral-400">•</span>
            <ol className="flex items-center space-x-2 text-sm text-neutral-500">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li>
                <Link
                  to="/venues"
                  className="hover:text-primary-600 transition-colors"
                >
                  Venues
                </Link>
              </li>
              <li>
                <ChevronRight size={14} />
              </li>
              <li className="text-neutral-900 font-medium">{venue.name}</li>
            </ol>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {hasImages ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft border border-white/50">
                <div className="relative h-96 group">
                  <img
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            currentImageIndex === 0
                              ? images.length - 1
                              : currentImageIndex - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-soft hover:shadow-soft-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={20} className="text-neutral-700" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            currentImageIndex === images.length - 1
                              ? 0
                              : currentImageIndex + 1,
                          )
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-soft hover:shadow-soft-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={20} className="text-neutral-700" />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex space-x-3 p-4 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `${venue.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl h-96 flex items-center justify-center border border-neutral-200">
                <div className="text-center">
                  <Eye size={48} className="text-neutral-400 mx-auto mb-3" />
                  <span className="text-neutral-500 text-lg font-medium">
                    No images available
                  </span>
                </div>
              </div>
            )}

            {/* Venue Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-3">
                  {venue.name}
                </h1>
                {venue.location && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin size={18} className="text-primary-500" />
                    <span>
                      {[
                        venue.location.address,
                        venue.location.city,
                        venue.location.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign size={18} className="text-primary-500" />
                    <div className="text-2xl font-bold text-primary-700">
                      ${venue.price}
                    </div>
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    per night
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={18} className="text-secondary-500" />
                    <div className="text-2xl font-bold text-secondary-700">
                      {venue.maxGuests}
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600 font-medium">
                    max guests
                  </div>
                </div>
                {venue.rating && (
                  <div className="text-center p-4 bg-warning-50 rounded-xl border border-warning-100">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star
                        size={18}
                        className="text-warning-500 fill-warning-500"
                      />
                      <div className="text-2xl font-bold text-warning-700">
                        {venue.rating}
                      </div>
                    </div>
                    <div className="text-sm text-warning-600 font-medium">
                      rating
                    </div>
                  </div>
                )}
                <div className="text-center p-4 bg-accent-50 rounded-xl border border-accent-100">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CalendarIcon size={18} className="text-accent-500" />
                    <div className="text-2xl font-bold text-accent-700">
                      {venue.bookings?.length || 0}
                    </div>
                  </div>
                  <div className="text-sm text-accent-600 font-medium">
                    bookings
                  </div>
                </div>
              </div>

              {venue.meta && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {venue.meta.wifi && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium bg-accent-50 text-accent-700 border border-accent-200">
                      <Wifi size={14} />
                      WiFi
                    </span>
                  )}
                  {venue.meta.parking && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium bg-success-50 text-success-700 border border-success-200">
                      <Car size={14} />
                      Parking
                    </span>
                  )}
                  {venue.meta.breakfast && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium bg-warning-50 text-warning-700 border border-warning-200">
                      <Coffee size={14} />
                      Breakfast
                    </span>
                  )}
                  {venue.meta.pets && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium bg-secondary-50 text-secondary-700 border border-secondary-200">
                      <PawPrint size={14} />
                      Pet-friendly
                    </span>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">
                  Description
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            </div>

            {/* Owner Info */}
            {venue.owner && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/50">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary-500" />
                  Hosted by {venue.owner.name}
                </h2>
                <div className="flex items-center space-x-4">
                  {venue.owner.avatar?.url ? (
                    <img
                      src={venue.owner.avatar.url}
                      alt={venue.owner.avatar.alt || venue.owner.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-200 shadow-soft"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-soft">
                      <User size={24} className="text-neutral-900" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      {venue.owner.name}
                    </h3>
                    {venue.owner.bio && (
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                        {venue.owner.bio}
                      </p>
                    )}
                    {venue.owner.venueManager && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-accent-100 text-accent-800 border border-accent-200 mt-2">
                        <UserCheck size={12} />
                        Venue Manager
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BookingForm
              venue={venue}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
            />

            <Calendar
              bookings={venue.bookings}
              selectedDateFrom={selectedDateFrom}
              selectedDateTo={selectedDateTo}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
