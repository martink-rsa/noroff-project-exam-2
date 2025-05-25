import { Link } from 'react-router-dom';
import { LazyImage } from '../ui/LazyImage';
import type { Venue } from '../../types';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const primaryImage = venue.media?.[0];
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" role="article" aria-labelledby={`venue-${venue.id}-title`}>
      <div className="relative h-48">
        {primaryImage ? (
          <LazyImage
            src={primaryImage.url}
            alt={primaryImage.alt || venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white px-2 py-1 rounded-md text-sm font-semibold text-gray-900">
            ${venue.price}/night
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 id={`venue-${venue.id}-title`} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {venue.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {venue.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {venue.location?.city && (
              <span className="text-sm text-gray-500">
                📍 {venue.location.city}
                {venue.location.country && `, ${venue.location.country}`}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            👥 Up to {venue.maxGuests} guests
          </div>
        </div>
        
        {venue.meta && (
          <div className="flex flex-wrap gap-1 mb-3">
            {venue.meta.wifi && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                📶 WiFi
              </span>
            )}
            {venue.meta.parking && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🚗 Parking
              </span>
            )}
            {venue.meta.breakfast && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                🥐 Breakfast
              </span>
            )}
            {venue.meta.pets && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🐕 Pet-friendly
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {venue.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">⭐</span>
              <span className="ml-1 text-sm font-medium text-gray-900">
                {venue.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          <Link
            to={`/venues/${venue.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby={`venue-${venue.id}-title`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}