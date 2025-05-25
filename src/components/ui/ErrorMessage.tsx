import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry, 
  className = '' 
}: ErrorMessageProps) {
  return (
    <div className={`bg-error-50 border border-error-200 rounded-xl p-4 ${className}`} role="alert" aria-live="polite">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-error-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-error-800">{title}</h3>
          <p className="mt-1 text-sm text-error-700">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 bg-error-100 text-error-800 px-3 py-2 rounded-xl text-sm hover:bg-error-200 transition-all duration-200 focus:ring-2 focus:ring-error-300 focus:ring-offset-2 font-medium"
                aria-label={`Retry: ${title}`}
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorPage({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.', 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-error-50 to-warning-50 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-white/50">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-error-400 to-warning-400 rounded-2xl flex items-center justify-center">
          <AlertCircle size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{title}</h1>
        <p className="text-neutral-600 mb-6 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-soft hover:shadow-soft-lg"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}