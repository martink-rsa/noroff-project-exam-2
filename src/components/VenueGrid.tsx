import { VenueCard } from './VenueCard';
import type { Venue } from '../types';

interface VenueGridProps {
  venues: Venue[];
  loading?: boolean;
  error?: string | null;
}

export function VenueGrid({ venues, loading, error }: VenueGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Venues
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <span className="text-4xl">🏠</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No venues found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}