interface VenueFiltersProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  totalCount?: number;
}

export function VenueFilters({ 
  sortBy, 
  sortOrder, 
  onSortChange, 
  totalCount 
}: VenueFiltersProps) {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    onSortChange(field, order as 'asc' | 'desc');
  };

  const sortValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="text-sm text-gray-600">
        {totalCount !== undefined && (
          <span>{totalCount} venue{totalCount !== 1 ? 's' : ''} found</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="created-desc">Newest first</option>
          <option value="created-asc">Oldest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="maxGuests-desc">Most guests</option>
          <option value="maxGuests-asc">Fewest guests</option>
        </select>
      </div>
    </div>
  );
}