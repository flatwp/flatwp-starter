/**
 * useSearch Hook
 * Client-side hook for search with debouncing and live updates
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SearchableItem, SearchFilters, SearchResponse, SearchConfig } from './types';
import { defaultSearchConfig } from './types';

interface UseSearchOptions extends Partial<SearchConfig> {
  filters?: SearchFilters;
  /** Enable auto-search on query change */
  autoSearch?: boolean;
}

interface UseSearchReturn {
  /** Current search query */
  query: string;
  /** Set the search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: SearchableItem[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Total results count */
  total: number;
  /** Whether more results are available */
  hasMore: boolean;
  /** Pagination cursor */
  endCursor?: string;
  /** Execute search manually */
  search: (searchQuery?: string) => Promise<void>;
  /** Load more results */
  loadMore: () => Promise<void>;
  /** Clear search results */
  clear: () => void;
  /** Current filters */
  filters: SearchFilters;
  /** Update filters */
  setFilters: (filters: SearchFilters) => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = defaultSearchConfig.debounceMs,
    minChars = defaultSearchConfig.minChars,
    resultsPerPage = defaultSearchConfig.resultsPerPage,
    filters: initialFilters = { type: 'all' },
    autoSearch = true,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (searchQuery: string, cursor?: string, append = false) => {
      if (searchQuery.length < minChars) {
        if (!append) {
          setResults([]);
          setTotal(0);
          setHasMore(false);
          setEndCursor(undefined);
        }
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        // Build query string
        const params = new URLSearchParams({
          q: searchQuery,
          limit: resultsPerPage.toString(),
        });

        if (filters.type && filters.type !== 'all') {
          params.set('type', filters.type);
        }
        if (filters.category) {
          params.set('category', filters.category);
        }
        if (filters.tag) {
          params.set('tag', filters.tag);
        }
        if (filters.dateFrom) {
          params.set('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
          params.set('dateTo', filters.dateTo);
        }
        if (cursor) {
          params.set('postsAfter', cursor);
          params.set('pagesAfter', cursor);
        }

        const response = await fetch(`/api/search?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data: SearchResponse = await response.json();

        if (append) {
          setResults(prev => [...prev, ...data.results]);
        } else {
          setResults(data.results);
        }
        setTotal(append ? results.length + data.results.length : data.total);
        setHasMore(data.hasMore);
        setEndCursor(data.endCursor);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        setError(err instanceof Error ? err.message : 'Search failed');
        if (!append) {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [minChars, resultsPerPage, filters, results.length]
  );

  // Manual search function
  const search = useCallback(
    async (searchQuery?: string) => {
      const q = searchQuery ?? query;
      setEndCursor(undefined);
      await performSearch(q);
    },
    [query, performSearch]
  );

  // Load more results
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || !endCursor) return;
    await performSearch(query, endCursor, true);
  }, [query, hasMore, isLoading, endCursor, performSearch]);

  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setHasMore(false);
    setEndCursor(undefined);
    setError(null);
  }, []);

  // Debounced auto-search on query change
  useEffect(() => {
    if (!autoSearch) return;

    const timeoutId = setTimeout(() => {
      setEndCursor(undefined);
      performSearch(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, autoSearch, performSearch]);

  // Re-search when filters change
  useEffect(() => {
    if (!autoSearch || query.length < minChars) return;

    setEndCursor(undefined);
    performSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    total,
    hasMore,
    endCursor,
    search,
    loadMore,
    clear,
    filters,
    setFilters,
  };
}
