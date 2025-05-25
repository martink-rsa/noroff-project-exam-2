import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useVenues } from '../../hooks/useVenues';
import { LoadingCard, ErrorMessage } from '../../components/ui';
import { Plus, Eye, Edit3, Trash2, Building2, Users, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-white/60 rounded-2xl w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/40 rounded-2xl w-1/4 animate-pulse"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">My Venues</h1>
            <p className="text-neutral-600 mt-1 flex items-center gap-2">
              <Building2 size={16} className="text-primary-500" />
              Manage your properties
            </p>
          </div>
          <Link
            to="/manager/venues/create"
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add New Venue
          </Link>
        </div>

        {myVenues.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 p-12 text-center">
            <div className="mb-6">
              <Building2 size={64} className="text-primary-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">No venues yet</h2>
            <p className="text-neutral-600 mb-6">Start earning by listing your first property</p>
            <Link
              to="/manager/venues/create"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 inline-flex items-center gap-3 font-medium"
            >
              <Plus size={18} />
              Create Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVenues.map((venue: Venue) => (
              <div key={venue.id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 overflow-hidden hover:shadow-soft-lg transition-all duration-300 group">
                {venue.media?.[0] && (
                  <div className="relative overflow-hidden">
                    <img
                      src={venue.media[0].url}
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">{venue.name}</h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      ${venue.price}/night
                    </span>
                    <span className="text-sm text-neutral-500 flex items-center gap-1">
                      <Users size={14} />
                      Max {venue.maxGuests}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                      {venue._count?.bookings || 0} booking(s)
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                      <Star size={14} className="text-yellow-500" />
                      {venue.rating || 'No ratings'}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="flex-1 bg-neutral-100 text-neutral-700 text-center py-2.5 px-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    <Link
                      to={`/manager/venues/${venue.id}/edit`}
                      className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-2.5 px-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit3 size={14} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      disabled={deleteLoading === venue.id}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
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