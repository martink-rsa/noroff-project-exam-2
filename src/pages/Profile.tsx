import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { profileUpdateSchema, type ProfileUpdateData } from '../types';
import { ApiError } from '../types';
import {
  User,
  Mail,
  Image,
  Save,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      bio: user?.bio || '',
      avatar: {
        url: user?.avatar?.url || '',
        alt: user?.avatar?.alt || '',
      },
      banner: {
        url: user?.banner?.url || '',
        alt: user?.banner?.alt || '',
      },
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setError(null);
      setSuccess(false);

      // Clean up empty strings to undefined
      const cleanedData = {
        bio: data.bio?.trim() || undefined,
        avatar: data.avatar?.url?.trim()
          ? {
              url: data.avatar.url.trim(),
              alt: data.avatar.alt?.trim() || undefined,
            }
          : undefined,
        banner: data.banner?.url?.trim()
          ? {
              url: data.banner.url.trim(),
              alt: data.banner.alt?.trim() || undefined,
            }
          : undefined,
      };

      await updateProfile(cleanedData);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update profile');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20 p-12 text-center">
          <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-800">Access Denied</h1>
          <p className="text-neutral-600 mt-2">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2 flex items-center gap-3">
            <User className="text-primary-500" />
            Profile Settings
          </h1>
          <p className="text-neutral-600">Manage your personal information</p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-lg border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 shadow-soft flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50/80 backdrop-blur-lg border border-green-200 text-green-700 px-4 py-3 rounded-2xl mb-6 shadow-soft flex items-center gap-2">
            <CheckCircle2 size={18} />
            Profile updated successfully!
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-soft border border-white/20">
          {/* Profile Header */}
          <div className="relative">
            {user.banner?.url ? (
              <img
                src={user.banner.url}
                alt={user.banner.alt || 'Profile banner'}
                className="w-full h-32 object-cover rounded-t-3xl"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-3xl"></div>
            )}

            <div className="absolute -bottom-8 left-6">
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.avatar.alt || user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white bg-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-12 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              {user.venueManager && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                  <Shield size={12} className="mr-1" />
                  Venue Manager
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Tell us about yourself (max 160 characters)"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bio.message as string}
                  </p>
                )}
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Image
                      size={18}
                      className="absolute left-3 top-3.5 text-neutral-400"
                    />
                    <input
                      {...register('avatar.url')}
                      type="url"
                      placeholder="Avatar image URL"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                  <input
                    {...register('avatar.alt')}
                    type="text"
                    placeholder="Avatar alt text (optional)"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
                {errors.avatar?.url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.avatar.url.message as string}
                  </p>
                )}
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Image
                      size={18}
                      className="absolute left-3 top-3.5 text-neutral-400"
                    />
                    <input
                      {...register('banner.url')}
                      type="url"
                      placeholder="Banner image URL"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                  <input
                    {...register('banner.alt')}
                    type="text"
                    placeholder="Banner alt text (optional)"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
                {errors.banner?.url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.banner.url.message as string}
                  </p>
                )}
              </div>

              {/* Account Info */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-3.5 text-neutral-400"
                      />
                      <input
                        type="text"
                        value={user.name}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl bg-neutral-50 text-neutral-500"
                      />
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      Username cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-3.5 text-neutral-400"
                      />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-2xl bg-neutral-50 text-neutral-500"
                      />
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-2xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2 font-medium"
                >
                  <Save size={16} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
