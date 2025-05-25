interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-neutral-200 border-t-primary-500 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50">
        <LoadingSpinner size="large" className="mx-auto mb-4" />
        <p className="text-neutral-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white rounded-2xl shadow-soft border border-neutral-100 p-6 ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-xl w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-xl w-1/2"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-xl w-2/3"></div>
      </div>
    </div>
  );
}