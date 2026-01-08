/**
 * Search Results Component
 * Displays search results with pagination and loading states
 */

'use client';

import { Loader2, Search, AlertCircle } from 'lucide-react';
import { SearchCard } from './SearchCard';
import type { SearchableItem } from '@/lib/search/types';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: SearchableItem[];
  query: string;
  isLoading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  highlightTerms?: string[];
  className?: string;
}

export function SearchResults({
  results,
  query,
  isLoading,
  error,
  total,
  hasMore,
  onLoadMore,
  highlightTerms = [],
  className,
}: SearchResultsProps) {
  // No query entered
  if (!query || query.length < 2) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Start typing to search
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter at least 2 characters to search posts, pages, and more
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <AlertCircle className="w-12 h-12 mx-auto text-destructive/50 mb-4" />
        <h3 className="text-lg font-medium text-destructive mb-2">
          Search Error
        </h3>
        <p className="text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  // Loading state (initial)
  if (isLoading && results.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">
          Searching for &ldquo;{query}&rdquo;...
        </p>
      </div>
    );
  }

  // No results
  if (results.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No results found
        </h3>
        <p className="text-sm text-muted-foreground">
          No content matching &ldquo;{query}&rdquo; was found.
          <br />
          Try different keywords or check your filters.
        </p>
      </div>
    );
  }

  // Results
  return (
    <div className={className}>
      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-medium text-foreground">{total}</span> result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {results.map((item) => (
          <SearchCard
            key={item.id}
            item={item}
            highlightTerms={highlightTerms}
            showTypeIcon
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border font-medium transition-colors',
              isLoading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card hover:bg-muted/50'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more results'
            )}
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {isLoading && results.length > 0 && (
        <div className="mt-4 text-center">
          <Loader2 className="w-6 h-6 mx-auto text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
