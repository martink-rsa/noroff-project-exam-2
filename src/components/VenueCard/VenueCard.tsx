import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Wifi, Car, Coffee, PawPrint, Eye } from 'lucide-react';
import { LazyImage } from '../ui/LazyImage';
import type { Venue } from '../../types';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const primaryImage = venue.media?.[0];
  
  return (
    <article className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border border-neutral-100" role="article" aria-labelledby={`venue-${venue.id}-title`}>
      <div className="relative h-52 overflow-hidden">
        {primaryImage ? (
          <LazyImage
            src={primaryImage.url}
            alt={primaryImage.alt || venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400 flex flex-col items-center gap-2">
              <Eye size={24} />
              No image available
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold text-neutral-900 shadow-soft border border-white/50">
            ${venue.price}<span className="text-xs font-medium text-neutral-600">/night</span>
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5">
        <h3 id={`venue-${venue.id}-title`} className="text-lg font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors duration-200">
          {venue.name}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {venue.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            {venue.location?.city && (
              <span className="flex items-center gap-1 text-sm text-neutral-500">
                <MapPin size={14} className="text-primary-500" />
                {venue.location.city}
                {venue.location.country && `, ${venue.location.country}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <Users size={14} className="text-secondary-500" />
            {venue.maxGuests} guests
          </div>
        </div>
        
        {venue.meta && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {venue.meta.wifi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200">
                <Wifi size={12} />
                WiFi
              </span>
            )}
            {venue.meta.parking && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-success-50 text-success-700 border border-success-200">
                <Car size={12} />
                Parking
              </span>
            )}
            {venue.meta.breakfast && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-warning-50 text-warning-700 border border-warning-200">
                <Coffee size={12} />
                Breakfast
              </span>
            )}
            {venue.meta.pets && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary-50 text-secondary-700 border border-secondary-200">
                <PawPrint size={12} />
                Pet-friendly
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {venue.rating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-warning-50 border border-warning-200">
              <Star size={14} className="text-warning-500 fill-warning-500" />
              <span className="text-sm font-bold text-warning-800">
                {venue.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          <Link
            to={`/venues/${venue.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-neutral-900 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-soft hover:shadow-soft-lg focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 group"
            aria-describedby={`venue-${venue.id}-title`}
          >
            <Eye size={16} className="group-hover:scale-110 transition-transform duration-200" />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}