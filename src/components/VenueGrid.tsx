import VenueCard from './VenueCard';
import { AlertTriangle, Building2 } from 'lucide-react';
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
          <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-soft overflow-hidden animate-pulse border border-white/20">
            <div className="h-48 bg-primary-100"></div>
            <div className="p-4">
              <div className="h-4 bg-primary-100 rounded-2xl mb-2"></div>
              <div className="h-3 bg-primary-50 rounded-2xl mb-3"></div>
              <div className="h-3 bg-primary-50 rounded-2xl w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <AlertTriangle size={64} className="text-error-400 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          Error Loading Venues
        </h3>
        <p className="text-neutral-600">{error}</p>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <Building2 size={64} className="text-neutral-300 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          No venues found
        </h3>
        <p className="text-neutral-600">
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