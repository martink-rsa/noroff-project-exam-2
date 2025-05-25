import { Link } from 'react-router-dom';
import { Building2, Star, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">Holidaze</h3>
            <p className="text-neutral-300 mb-4 leading-relaxed">
              Find your perfect accommodation for your next holiday. Book with confidence
              and discover amazing places to stay around the world.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center gap-2 text-neutral-300 hover:text-primary-400 transition-colors">
                  <Building2 size={16} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/venues" className="flex items-center gap-2 text-neutral-300 hover:text-primary-400 transition-colors">
                  <Building2 size={16} />
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 text-neutral-300 hover:text-secondary-400 transition-colors">
                  <Star size={16} />
                  Join as Host
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8 mt-8">
          <p className="text-center text-neutral-400 flex items-center justify-center gap-1">
            © {new Date().getFullYear()} Holidaze. Made with <Heart size={16} className="text-error-400" /> for travelers.
          </p>
        </div>
      </div>
    </footer>
  );
}