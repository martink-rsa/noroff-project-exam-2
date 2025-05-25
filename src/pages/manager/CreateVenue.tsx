import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/ui';

const venueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  media: z.array(z.object({
    url: z.string().url('Must be a valid URL'),
    alt: z.string().optional()
  })).optional(),
  price: z.number().min(1, 'Price must be at least $1'),
  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest').max(100, 'Cannot exceed 100 guests'),
  rating: z.number().min(0).max(5).optional(),
  meta: z.object({
    wifi: z.boolean(),
    parking: z.boolean(),
    breakfast: z.boolean(),
    pets: z.boolean()
  }),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    continent: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

type VenueFormData = z.infer<typeof venueSchema>;

export default function CreateVenue() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false
      },
      location: {}
    }
  });

  const addMediaUrl = () => {
    setMediaUrls([...mediaUrls, '']);
  };

  const removeMediaUrl = (index: number) => {
    const newUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(newUrls);
    updateMediaValue(newUrls);
  };

  const updateMediaUrl = (index: number, url: string) => {
    const newUrls = [...mediaUrls];
    newUrls[index] = url;
    setMediaUrls(newUrls);
    updateMediaValue(newUrls);
  };

  const updateMediaValue = (urls: string[]) => {
    const validUrls = urls.filter(url => url.trim() !== '');
    setValue('media', validUrls.map(url => ({ url, alt: '' })));
  };

  const onSubmit = async (data: VenueFormData) => {
    setLoading(true);
    try {
      await apiService.createVenue(data);
      showSuccess('Venue created successfully!', 'Success');
      navigate('/manager/venues');
    } catch (error) {
      console.error('Error creating venue:', error);
      showError('Failed to create venue. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Venue</h1>
          <p className="text-gray-600 mt-1">Add a new property to your listings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beautiful Oceanview Apartment"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your venue, its amenities, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per night ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Guests *
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    {...register('maxGuests', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4"
                  />
                  {errors.maxGuests && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Photos</h2>
            
            <div className="space-y-4">
              {mediaUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateMediaUrl(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {mediaUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMediaUrl(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMediaUrl}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add another photo
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('meta.wifi')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">WiFi</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('meta.parking')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Parking</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('meta.breakfast')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Breakfast</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('meta.pets')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Pets Allowed</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('location.address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('location.city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  {...register('location.country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="United States"
                />
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  {...register('location.zip')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/manager/venues')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center">
                {loading && <LoadingSpinner size="small" className="mr-2" />}
                {loading ? 'Creating...' : 'Create Venue'}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}