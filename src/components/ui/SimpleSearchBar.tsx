interface SimpleSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  searching?: boolean;
}

export default function SimpleSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  sortBy,
  onSortChange,
  totalItems,
  currentPage,
  itemsPerPage,
  searching = false
}: SimpleSearchBarProps) {
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'least-viewed', label: 'Least Viewed' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Sort and Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Results count and loading */}
          <div className="flex items-center gap-4">
            {searching && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Searching...</span>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              {totalItems > 0 ? (
                <>
                  Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
                </>
              ) : (
                'No results found'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
