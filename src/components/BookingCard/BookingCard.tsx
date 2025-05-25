import { useState } from 'react';
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, DollarSign, Trash2, Eye, Clock, X, Check } from 'lucide-react';
import type { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onDelete?: (id: string) => Promise<void>;
}

export default function BookingCard({ booking, onDelete }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const checkInDate = parseISO(booking.dateFrom);
  const checkOutDate = parseISO(booking.dateTo);
  const nights = differenceInDays(checkOutDate, checkInDate);
  const isUpcoming = !isPast(checkInDate);
  const totalPrice = booking.venue ? nights * booking.venue.price : 0;

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(booking.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden hover:shadow-soft-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Venue Image */}
        <div className="md:w-1/3 relative overflow-hidden">
          {booking.venue?.media?.[0] ? (
            <img
              src={booking.venue.media[0].url}
              alt={booking.venue.media[0].alt || booking.venue.name}
              className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              <span className="text-neutral-400 flex flex-col items-center gap-2">
                <Eye size={24} />
                No image
              </span>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {booking.venue ? (
                  <Link 
                    to={`/venues/${booking.venue.id}`}
                    className="hover:text-primary-600 transition-colors group"
                  >
                    <span className="group-hover:underline">{booking.venue.name}</span>
                  </Link>
                ) : (
                  'Unknown Venue'
                )}
              </h3>
              {booking.venue?.location && (
                <div className="flex items-center gap-1.5 text-neutral-600 text-sm">
                  <MapPin size={14} className="text-primary-500" />
                  {[booking.venue.location.city, booking.venue.location.country]
                    .filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
                isUpcoming 
                  ? 'bg-success-100 text-success-800 border border-success-200' 
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}>
                <Clock size={12} />
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-primary-50 p-3 rounded-xl border border-primary-100">
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={14} className="text-primary-500" />
                <p className="text-xs font-medium text-primary-700">Check-in</p>
              </div>
              <p className="font-bold text-neutral-900">{format(checkInDate, 'MMM dd, yyyy')}</p>
            </div>
            <div className="bg-secondary-50 p-3 rounded-xl border border-secondary-100">
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={14} className="text-secondary-500" />
                <p className="text-xs font-medium text-secondary-700">Check-out</p>
              </div>
              <p className="font-bold text-neutral-900">{format(checkOutDate, 'MMM dd, yyyy')}</p>
            </div>
            <div className="bg-accent-50 p-3 rounded-xl border border-accent-100">
              <div className="flex items-center gap-1 mb-1">
                <Users size={14} className="text-accent-500" />
                <p className="text-xs font-medium text-accent-700">Guests</p>
              </div>
              <p className="font-bold text-neutral-900">{booking.guests}</p>
            </div>
            <div className="bg-warning-50 p-3 rounded-xl border border-warning-100">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign size={14} className="text-warning-500" />
                <p className="text-xs font-medium text-warning-700">Total</p>
              </div>
              <p className="font-bold text-neutral-900">${totalPrice}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500 flex items-center gap-1">
              <Clock size={14} />
              {nights} night{nights !== 1 ? 's' : ''} • 
              Booked on {format(parseISO(booking.created), 'MMM dd, yyyy')}
            </div>
            
            {isUpcoming && onDelete && (
              <div className="flex items-center gap-2">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 text-error-600 hover:text-error-700 hover:bg-error-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    <Trash2 size={14} />
                    Cancel Booking
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex items-center gap-1 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      <X size={14} />
                      Keep
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1 bg-error-500 hover:bg-error-600 disabled:bg-error-300 text-neutral-900 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <Check size={14} />
                      {isDeleting ? 'Canceling...' : 'Confirm Cancel'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}