import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
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
    <form onSubmit={handleSubmit} className={`flex ${className}`} role="search" aria-label="Search venues">
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">
          Search for venues
        </label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          Enter keywords to search for venues. Press Enter or click the search button to start searching.
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-r-lg font-medium transition-colors text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Search for venues"
      >
        <span className="hidden sm:inline">Search</span>
        <span className="sm:hidden" aria-hidden="true">🔍</span>
      </button>
    </form>
  );
}