import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Image, Edit3, UserCheck, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../ui';
import { registerSchema, type RegisterData } from '../../types';
import { ApiError } from '../../types/api';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      venueManager: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setError(null);
      await registerUser(data);
      showSuccess('Account created successfully!', 'Welcome to Holidaze');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        showError(err.message, 'Registration failed');
      } else {
        const errorMessage = 'An unexpected error occurred';
        setError(errorMessage);
        showError(errorMessage, 'Registration failed');
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center mb-4">
          <UserCheck size={28} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-700 to-accent-700 bg-clip-text text-transparent">
          Join Holidaze
        </h2>
        <p className="mt-3 text-neutral-600">
          Create your account and start exploring
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
          >
            <LogIn size={14} />
            Sign in here
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3.5 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle size={18} className="text-error-500 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-neutral-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              autoComplete="username"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.name 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`}
              placeholder="username123"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-neutral-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`}
              placeholder="your.email@stud.noroff.no"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-neutral-400" />
            </div>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.password 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`}
              placeholder="Password (min 8 characters)"
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
            Bio (optional)
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <Edit3 size={18} className="text-neutral-400" />
            </div>
            <textarea
              {...register('bio')}
              rows={3}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.bio 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none`}
              placeholder="Tell us about yourself (max 160 characters)"
            />
          </div>
          {errors.bio && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.bio.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="avatar" className="block text-sm font-medium text-neutral-700 mb-2">
            Avatar URL (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image size={18} className="text-neutral-400" />
            </div>
            <input
              {...register('avatar.url')}
              type="url"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.avatar?.url 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {errors.avatar?.url && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.avatar.url.message}
            </p>
          )}
        </div>

        <div className="flex items-center p-4 bg-accent-50 rounded-xl border border-accent-200">
          <input
            {...register('venueManager')}
            type="checkbox"
            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded transition-colors"
          />
          <label htmlFor="venueManager" className="ml-3 flex items-center gap-2 text-sm text-neutral-900 font-medium">
            <UserCheck size={16} className="text-accent-600" />
            Register as venue manager
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                Creating account...
              </>
            ) : (
              <>
                <UserCheck size={18} className="group-hover:scale-110 transition-transform duration-200" />
                Create your account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}