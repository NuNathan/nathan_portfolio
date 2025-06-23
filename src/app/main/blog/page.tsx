'use client';

import { useState, useEffect } from 'react';
import ProjectSlide from "@/components/project-slide/ProjectSlide";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { getPosts, PostData, PostsQueryParams } from "@/api/posts";

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState('latest');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 6;

  // Debounce search term to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Set searching state when user is typing but debounced term hasn't updated yet
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch posts when parameters change (only when debounced search term changes)
  useEffect(() => {
    const fetchPosts = async () => {
      // Only show loading skeleton on initial page load, not during searches
      if (initialLoading) {
        // Keep initial loading state for skeleton
      }

      try {
        const params: PostsQueryParams = {
          page: currentPage,
          pageSize: itemsPerPage,
          search: debouncedSearchTerm,
          type: selectedType === 'all' ? undefined : selectedType as 'project' | 'blog',
          sortBy: sortBy as 'latest' | 'oldest' | 'most-viewed' | 'least-viewed'
        };

        const response = await getPosts(params);
        setPosts(response.data);
        setTotalPages(response.meta.pagination.pageCount);
        setTotalItems(response.meta.pagination.total);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        // Only set initial loading to false after the first load
        if (initialLoading) {
          setInitialLoading(false);
        }
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearchTerm, selectedType, sortBy, initialLoading]); // Add initialLoading to dependencies

  // Reset to page 1 when search or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-0">
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Thoughts, tutorials, and insights from my journey in software engineering
        </p>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Results count */}
      <div className="mb-6 flex items-center space-x-8">
        <p className="text-gray-600">
          {initialLoading ? (
            'Loading...'
          ) : (
            <>
              Showing <span className="font-semibold">{posts.length}</span> of <span className="font-semibold">{totalItems}</span> articles
            </>
          )}
        </p>

        {/* Search loading indicator */}
        {searching && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Searching...</span>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {initialLoading ? (
          // Loading skeleton for initial load
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : (
          /* Show current posts with optional search overlay */
          <div className={`contents ${searching ? 'opacity-75' : ''}`}>
            {posts.length > 0 ? (
              posts.map((item) => (
                <ProjectSlide
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  img={item.img}
                  tags={item.tags}
                  type={item.type}
                  date={item.date}
                  views={item.views}
                  readTime={item.readTime}
                  links={item.links}
                  slug={item.slug}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
