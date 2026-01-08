/**
 * Search Page Content Component
 * Client-side interactive search with filters and results
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/lib/search/useSearch';
import { SearchFilters, SearchResults } from '@/components/search';
import type { Category, Tag } from '@/lib/wordpress/types';
import type { SearchFilters as SearchFiltersType } from '@/lib/search/types';
import { cn } from '@/lib/utils';

interface SearchPageContentProps {
  categories: Category[];
  tags: Tag[];
}

export function SearchPageContent({ categories, tags }: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial query from URL
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as SearchFiltersType['type']) || 'all';
  const initialCategory = searchParams.get('category') || undefined;
  const initialTag = searchParams.get('tag') || undefined;

  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    total,
    hasMore,
    loadMore,
    clear,
    filters,
    setFilters,
  } = useSearch({
    debounceMs: 300,
    minChars: 2,
    resultsPerPage: 10,
    filters: {
      type: initialType,
      category: initialCategory,
      tag: initialTag,
    },
    autoSearch: true,
  });

  // Initialize query from URL
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query, setQuery]);

  // Update URL when query/filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.tag) params.set('tag', filters.tag);

    const newUrl = params.toString() ? `/search?${params}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [query, filters, router]);

  const handleClear = () => {
    clear();
    router.replace('/search', { scroll: false });
  };

  const searchTerms = query.split(/\s+/).filter(t => t.length >= 2);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar - Filters */}
      <aside className="lg:w-72 flex-shrink-0 order-2 lg:order-1">
        <div className="lg:sticky lg:top-24">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            tags={tags}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 order-1 lg:order-2">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, pages, and more..."
              className="w-full h-14 pl-12 pr-12 text-lg rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Active Search Indicator */}
          {query && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Searching for:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
                {query}
                <button
                  onClick={handleClear}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Results */}
        <SearchResults
          results={results}
          query={query}
          isLoading={isLoading}
          error={error}
          total={total}
          hasMore={hasMore}
          onLoadMore={loadMore}
          highlightTerms={searchTerms}
        />
      </main>
    </div>
  );
}
