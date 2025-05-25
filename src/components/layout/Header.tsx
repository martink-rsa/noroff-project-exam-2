import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Building2, LayoutDashboard, Calendar, User, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100 shadow-soft">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300">
                Holidaze
              </h1>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link
                to="/"
                className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <Home size={16} />
                Home
              </Link>
              <Link
                to="/venues"
                className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <Building2 size={16} />
                Venues
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <Calendar size={16} />
                  My Bookings
                </Link>
                
                <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-primary-100">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.avatar.alt || 'Profile'}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-200"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                      <User size={16} className="text-neutral-900" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-neutral-800 text-sm font-medium leading-none">
                      {user?.name}
                    </span>
                    {user?.venueManager && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-accent-600">
                        <UserCheck size={12} />
                        Manager
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-neutral-100 hover:bg-error-100 text-neutral-700 hover:text-error-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <User size={16} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-neutral-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-soft"
                >
                  <UserCheck size={16} />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-neutral-700 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-xl transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <Menu size={24} />
              ) : (
                <X size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-sm border-t border-primary-100">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
              >
                <Home size={18} />
                Home
              </Link>
              <Link
                to="/venues"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
              >
                <Building2 size={18} />
                Venues
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    <Calendar size={18} />
                    My Bookings
                  </Link>
                  
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary-50 border border-primary-200">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.avatar.alt || 'Profile'}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                        <User size={18} className="text-neutral-900" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-neutral-800 text-base font-medium leading-none">
                        {user?.name}
                      </span>
                      {user?.venueManager && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-accent-600">
                          <UserCheck size={12} />
                          Manager
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full bg-error-50 hover:bg-error-100 text-error-700 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    <User size={18} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-neutral-900 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 shadow-soft"
                  >
                    <UserCheck size={18} />
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}