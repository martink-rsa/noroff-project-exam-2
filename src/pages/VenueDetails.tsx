import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar } from '../components/Calendar';
import { BookingForm } from '../components/BookingForm';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Venue Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The venue you are looking for does not exist.'}</p>
          <Link
            to="/venues"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Venues
          </Link>
        </div>
      </div>
    );
  }

  const images = venue.media || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>→</li>
            <li><Link to="/venues" className="hover:text-blue-600">Venues</Link></li>
            <li>→</li>
            <li className="text-gray-900">{venue.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {hasImages ? (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-96">
                  <img
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
                        )}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
                        )}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
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
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-400 text-lg">No images available</span>
              </div>
            )}

            {/* Venue Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                {venue.location && (
                  <p className="text-gray-600">
                    📍 {[venue.location.address, venue.location.city, venue.location.country]
                      .filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${venue.price}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{venue.maxGuests}</div>
                  <div className="text-sm text-gray-600">max guests</div>
                </div>
                {venue.rating && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">⭐ {venue.rating}</div>
                    <div className="text-sm text-gray-600">rating</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {venue.bookings?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">bookings</div>
                </div>
              </div>

              {venue.meta && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {venue.meta.wifi && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      📶 WiFi
                    </span>
                  )}
                  {venue.meta.parking && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      🚗 Parking
                    </span>
                  )}
                  {venue.meta.breakfast && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      🥐 Breakfast
                    </span>
                  )}
                  {venue.meta.pets && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      🐕 Pet-friendly
                    </span>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{venue.description}</p>
              </div>
            </div>

            {/* Owner Info */}
            {venue.owner && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Hosted by {venue.owner.name}</h2>
                <div className="flex items-center space-x-4">
                  {venue.owner.avatar?.url && (
                    <img
                      src={venue.owner.avatar.url}
                      alt={venue.owner.avatar.alt || venue.owner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{venue.owner.name}</h3>
                    {venue.owner.bio && (
                      <p className="text-sm text-gray-600 mt-1">{venue.owner.bio}</p>
                    )}
                    {venue.owner.venueManager && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
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