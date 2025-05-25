import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Venues
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find the perfect accommodation for your next trip
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Search results for "{query}"
              </h2>
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