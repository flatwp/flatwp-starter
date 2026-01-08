/**
 * Search Configuration
 * Controls search behavior, UI, and filtering options
 */

export const searchConfig = {
  /**
   * General search settings
   */
  general: {
    /** Minimum characters before search triggers */
    minChars: 2,
    /** Debounce delay in milliseconds */
    debounceMs: 300,
    /** Results per page */
    resultsPerPage: 10,
    /** Default placeholder text */
    placeholder: 'Search posts and pages...',
  },

  /**
   * Search widget settings (sidebar/header)
   */
  widget: {
    /** Show dropdown results in widget */
    showDropdown: true,
    /** Maximum results to show in dropdown */
    maxDropdownResults: 5,
    /** Show keyboard shortcuts hint */
    showKeyboardHint: true,
  },

  /**
   * Search page settings
   */
  page: {
    /** Show filter sidebar */
    showFilters: true,
    /** Default content type filter */
    defaultType: 'all' as 'all' | 'post' | 'page',
    /** Show date range filter */
    showDateFilter: true,
    /** Show category filter */
    showCategoryFilter: true,
    /** Show tag filter */
    showTagFilter: true,
  },

  /**
   * Search card settings
   */
  card: {
    /** Show content type icon */
    showTypeIcon: true,
    /** Maximum excerpt length */
    excerptLength: 120,
    /** Maximum categories to show */
    maxCategories: 2,
    /** Maximum tags to show */
    maxTags: 2,
    /** Highlight search terms */
    highlightTerms: true,
  },

  /**
   * Header search button settings
   */
  header: {
    /** Show search button in header */
    enabled: true,
    /** Show keyboard shortcut (Cmd/Ctrl + K) */
    showShortcut: true,
  },
} as const;

export type SearchConfig = typeof searchConfig;
