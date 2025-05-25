import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search venues...", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        navigate(`/venues?search=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search" aria-label="Search venues">
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search for venues
        </label>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MapPin size={18} className="text-neutral-400" />
        </div>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-3.5 text-sm border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-soft hover:shadow-soft-lg placeholder-neutral-500"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          Enter keywords to search for venues. Press Enter or click the search button to start searching.
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 mr-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 rounded-xl font-medium transition-all duration-200 text-sm focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 shadow-soft hover:shadow-soft-lg group"
          aria-label="Search for venues"
        >
          <span className="hidden sm:inline-flex items-center gap-2">
            <Search size={16} className="group-hover:scale-110 transition-transform duration-200" />
            Search
          </span>
          <span className="sm:hidden">
            <Search size={16} className="group-hover:scale-110 transition-transform duration-200" />
          </span>
        </button>
      </div>
    </form>
  );
}