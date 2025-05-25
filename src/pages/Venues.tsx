import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { VenueGrid } from '../components/VenueGrid';
import { VenueFilters } from '../components/VenueFilters';
import Pagination from '../components/Pagination';
import { useVenueSearch } from '../hooks';

export default function Venues() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const {
    venues,
    loading,
    error,
    query,
    currentPage,
    totalPages,
    totalCount,
    sortBy,
    sortOrder,
    search,
    setPage,
    setSort,
  } = useVenueSearch({ initialQuery });

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      search(initialQuery);
    }
  }, [initialQuery, query, search]);

  const handleSearch = (searchQuery: string) => {
    search(searchQuery);
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSort(newSortBy, newSortOrder);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 to-secondary-50/30">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary-100/50 to-secondary-100/50 border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl">
                <Building2 size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                Discover Amazing Venues
              </h1>
            </div>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Find the perfect accommodation for your next trip with our curated collection of unique venues
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search by location, venue name, or description..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {query && (
            <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-soft">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  Search results for "<span className="text-primary-600">{query}</span>"
                </h2>
              </div>
            </div>
          )}
          
          <VenueFilters
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            totalCount={totalCount}
          />
          
          <VenueGrid
            venues={venues}
            loading={loading}
            error={error}
          />
          
          {totalPages > 1 && !loading && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}