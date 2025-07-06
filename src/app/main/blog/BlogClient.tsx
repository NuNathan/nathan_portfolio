'use client';

import { useState, useEffect } from 'react';
import ProjectSlide from "@/components/project-slide/ProjectSlide";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { getPosts, PostData, PostsQueryParams } from "@/api/posts";

interface BlogClientProps {
  initialPosts: PostData[];
  initialTotalPages: number;
  initialTotalItems: number;
}

export default function BlogClient({ 
  initialPosts, 
  initialTotalPages, 
  initialTotalItems 
}: BlogClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState('latest');
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [searching, setSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched/filtered

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
    // If no search/filter changes, use initial data
    if (!hasSearched && debouncedSearchTerm === '' && selectedType === 'all' && sortBy === 'latest' && currentPage === 1) {
      return;
    }

    const fetchPosts = async () => {
      try {
        setHasSearched(true);
        
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
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearchTerm, selectedType, sortBy]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, selectedType, sortBy]);

  return (
    <>
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
          <>
            Showing <span className="font-semibold">{posts.length}</span> of <span className="font-semibold">{totalItems}</span> articles
          </>
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
        {/* Show current posts with optional search overlay */}
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
