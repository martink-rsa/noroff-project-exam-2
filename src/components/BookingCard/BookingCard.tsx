import { useState } from 'react';
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Booking } from '../types';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Venue Image */}
        <div className="md:w-1/3">
          {booking.venue?.media?.[0] ? (
            <img
              src={booking.venue.media[0].url}
              alt={booking.venue.media[0].alt || booking.venue.name}
              className="w-full h-48 md:h-full object-cover"
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {booking.venue ? (
                  <Link 
                    to={`/venues/${booking.venue.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {booking.venue.name}
                  </Link>
                ) : (
                  'Unknown Venue'
                )}
              </h3>
              {booking.venue?.location && (
                <p className="text-gray-600 text-sm">
                  📍 {[booking.venue.location.city, booking.venue.location.country]
                    .filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isUpcoming 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium">{format(checkInDate, 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium">{format(checkOutDate, 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-medium">${totalPrice}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {nights} night{nights !== 1 ? 's' : ''} • 
              Booked on {format(parseISO(booking.created), 'MMM dd, yyyy')}
            </div>
            
            {isUpcoming && onDelete && (
              <div className="flex space-x-2">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Keep
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
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