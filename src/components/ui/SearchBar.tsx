import CustomDropdown from './CustomDropdown';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedType,
  onTypeChange
}: SearchBarProps) {
  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'least-viewed', label: 'Least Viewed' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'project', label: 'Projects' },
    { value: 'blog', label: 'Blog Posts' }
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
            placeholder="Search articles and tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Sort Filter */}
          <CustomDropdown
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            className="w-full sm:min-w-[140px] sm:w-auto"
          />

          {/* Type Filter */}
          <CustomDropdown
            value={selectedType}
            onChange={onTypeChange}
            options={typeOptions}
            className="w-full sm:min-w-[120px] sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
