import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../ui';
import { loginSchema, type LoginData } from '../../types';
import { ApiError } from '../../types/api';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setError(null);
      await login(data.email, data.password);
      showSuccess('Welcome back!', 'Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        showError(err.message, 'Login failed');
      } else {
        const errorMessage = 'An unexpected error occurred';
        setError(errorMessage);
        showError(errorMessage, 'Login failed');
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mb-4">
          <LogIn size={28} className="text-neutral-900" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
          Welcome back
        </h2>
        <p className="mt-3 text-neutral-600">
          Sign in to your account to continue
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
          >
            <UserPlus size={14} />
            Create one here
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
              autoComplete="current-password"
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.password 
                  ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                  : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
              } rounded-xl placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={14} />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-neutral-900 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft hover:shadow-soft-lg"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} className="group-hover:scale-110 transition-transform duration-200" />
                Sign in to your account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}