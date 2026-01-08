/**
 * Search System Types
 */

export interface SearchableItem {
  id: string;
  type: 'post' | 'page';
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
  author?: string;
  featuredImage?: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface SearchFilters {
  type?: 'post' | 'page' | 'all';
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResponse {
  results: SearchableItem[];
  total: number;
  query: string;
  filters: SearchFilters;
  hasMore: boolean;
  endCursor?: string;
}

export interface SearchConfig {
  /** Minimum characters before search triggers */
  minChars: number;
  /** Debounce delay in milliseconds */
  debounceMs: number;
  /** Results per page */
  resultsPerPage: number;
  /** Show suggestions */
  showSuggestions: boolean;
  /** Placeholder text */
  placeholder: string;
}

export const defaultSearchConfig: SearchConfig = {
  minChars: 2,
  debounceMs: 300,
  resultsPerPage: 10,
  showSuggestions: true,
  placeholder: 'Search posts and pages...',
};
