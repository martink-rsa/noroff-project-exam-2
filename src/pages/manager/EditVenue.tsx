import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../../services/api';
import type { Venue } from '../../types/api';
import { ArrowLeft, Building2, Image, MapPin, Wifi, Car, Coffee, PawPrint, Plus, Trash2, Edit3 } from 'lucide-react';

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

export default function EditVenue() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
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

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.getVenue(id);
        const venueData = response.data;
        setVenue(venueData);
        
        // Populate form with existing data
        reset({
          name: venueData.name,
          description: venueData.description,
          price: venueData.price,
          maxGuests: venueData.maxGuests,
          meta: venueData.meta || {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false
          },
          location: venueData.location || {},
          media: venueData.media || []
        });

        // Set media URLs for the form
        const urls = venueData.media?.map((m) => m.url) || [''];
        setMediaUrls(urls.length > 0 ? urls : ['']);
      } catch (error) {
        console.error('Error fetching venue:', error);
        alert('Failed to load venue data');
        navigate('/manager/venues');
      }
    };

    fetchVenue();
  }, [id, reset, navigate]);

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
    if (!id) return;
    
    setLoading(true);
    try {
      await apiService.updateVenue(id, data);
      navigate('/manager/venues');
    } catch (error) {
      console.error('Error updating venue:', error);
      alert('Failed to update venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-primary-100 rounded-2xl w-1/3"></div>
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft">
              <div className="space-y-4">
                <div className="h-4 bg-primary-50 rounded-2xl w-1/4"></div>
                <div className="h-10 bg-primary-50 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
            <Edit3 className="text-primary-500" />
            Edit Venue
          </h1>
          <p className="text-neutral-600 mt-1">Update your property details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft border border-white/20">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-primary-500" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                  {errors.maxGuests && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft border border-white/20">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center gap-2">
              <Image size={20} className="text-primary-500" />
              Photos
            </h2>
            
            <div className="space-y-4">
              {mediaUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateMediaUrl(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                  {mediaUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMediaUrl(index)}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMediaUrl}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus size={16} />
                Add another photo
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft border border-white/20">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-2xl hover:bg-primary-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('meta.wifi')}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Wifi size={18} className="text-primary-500" />
                <span className="text-sm text-neutral-700 font-medium">WiFi</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-2xl hover:bg-primary-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('meta.parking')}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Car size={18} className="text-primary-500" />
                <span className="text-sm text-neutral-700 font-medium">Parking</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-2xl hover:bg-primary-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('meta.breakfast')}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Coffee size={18} className="text-primary-500" />
                <span className="text-sm text-neutral-700 font-medium">Breakfast</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-2xl hover:bg-primary-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register('meta.pets')}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <PawPrint size={18} className="text-primary-500" />
                <span className="text-sm text-neutral-700 font-medium">Pets Allowed</span>
              </label>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-soft border border-white/20">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-primary-500" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('location.address')}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/manager/venues')}
              className="px-8 py-3 border border-neutral-300 text-neutral-700 rounded-2xl hover:bg-neutral-50 transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center gap-2 font-medium"
            >
              {loading ? 'Updating...' : (
                <>
                  <Edit3 size={16} />
                  Update Venue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}