'use client';

import { useState, useEffect } from 'react';
import { PostData, PostsQueryParams, getPosts } from '@/api/posts';
import ProjectSlide from '@/components/project-slide/ProjectSlide';
import SimpleSearchBar from '@/components/ui/SimpleSearchBar';
import Pagination from '@/components/ui/Pagination';

interface ProjectsClientProps {
  initialProjects: PostData[];
  initialTotalPages: number;
  initialTotalItems: number;
}

export default function ProjectsClient({
  initialProjects,
  initialTotalPages,
  initialTotalItems
}: ProjectsClientProps) {
  const [projects, setProjects] = useState<PostData[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'most-viewed' | 'least-viewed'>('latest');
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const itemsPerPage = 12;

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

  // Check if we should use initial data (no filters applied)
  const shouldUseInitialData = !hasSearched && 
    debouncedSearchTerm === '' && 
    sortBy === 'latest' && 
    currentPage === 1;

  // Fetch projects when parameters change
  useEffect(() => {
    if (shouldUseInitialData) return;

    const fetchProjects = async () => {
      try {
        setHasSearched(true);
        
        const params: PostsQueryParams = {
          page: currentPage,
          pageSize: itemsPerPage,
          search: debouncedSearchTerm,
          type: 'project',
          sortBy: sortBy
        };

        const response = await getPosts(params);
        setProjects(response.data);
        setTotalPages(response.meta.pagination.pageCount);
        setTotalItems(response.meta.pagination.total);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    };

    fetchProjects();
  }, [currentPage, debouncedSearchTerm, sortBy, hasSearched, shouldUseInitialData]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as 'latest' | 'oldest' | 'most-viewed' | 'least-viewed');
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <SimpleSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Search projects..."
        sortBy={sortBy}
        onSortChange={handleSortChange}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        searching={searching}
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Show current projects with optional search overlay */}
        <div className={`contents ${searching ? 'opacity-75' : ''}`}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectSlide
                key={project.id}
                title={project.title}
                description={project.description}
                img={project.img}
                tags={project.tags || []}
                type="project"
                links={project.links || {}}
                slug={project.slug}
                date={project.date}
                views={project.views}
                readTime={project.readTime}
                source="projects"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mb-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
