import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useVenues } from '../../hooks/useVenues';
import { LoadingCard, ErrorMessage } from '../../components/ui';
import type { Venue } from '../../types/api';

export default function MyVenues() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { venues, loading, error, refetch } = useVenues();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const myVenues = venues.filter(venue => venue.owner?.email === user?.email);

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(venueId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/holidaze/venues/${venueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }

      showSuccess('Venue deleted successfully!', 'Success');
      refetch();
    } catch (error) {
      console.error('Error deleting venue:', error);
      showError('Failed to delete venue. Please try again.', 'Error');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage
            title="Failed to load venues"
            message={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
            <p className="text-gray-600 mt-1">Manage your properties</p>
          </div>
          <Link
            to="/manager/venues/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Venue
          </Link>
        </div>

        {myVenues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No venues yet</h2>
            <p className="text-gray-600 mb-6">Start earning by listing your first property</p>
            <Link
              to="/manager/venues/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Create Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVenues.map((venue: Venue) => (
              <div key={venue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {venue.media?.[0] && (
                  <img
                    src={venue.media[0].url}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{venue.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${venue.price}/night
                    </span>
                    <span className="text-sm text-gray-500">
                      Max {venue.maxGuests} guests
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      {(venue._count as { bookings?: number })?.bookings || 0} booking(s)
                    </div>
                    <div className="text-sm text-gray-500">
                      Rating: {venue.rating || 'No ratings'}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-3 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      View
                    </Link>
                    <Link
                      to={`/manager/venues/${venue.id}/edit`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      disabled={deleteLoading === venue.id}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {deleteLoading === venue.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}