/**
 * Search Input Component
 * Reusable search input with dropdown results for sidebar/header
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearch } from '@/lib/search/useSearch';
import { SearchCard } from './SearchCard';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  /** Placeholder text */
  placeholder?: string;
  /** Show dropdown results */
  showDropdown?: boolean;
  /** Maximum dropdown results */
  maxDropdownResults?: number;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Callback when search is submitted */
  onSubmit?: (query: string) => void;
  /** Custom class name */
  className?: string;
  /** Input size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show active search indicator */
  showActiveIndicator?: boolean;
}

const sizeClasses = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
};

export function SearchInput({
  placeholder = 'Search posts...',
  showDropdown = true,
  maxDropdownResults = 5,
  autoFocus = false,
  onSubmit,
  className,
  size = 'md',
  showActiveIndicator = true,
}: SearchInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const {
    query,
    setQuery,
    results,
    isLoading,
    clear,
  } = useSearch({
    debounceMs: 300,
    minChars: 2,
    resultsPerPage: maxDropdownResults,
    autoSearch: showDropdown,
  });

  const displayResults = results.slice(0, maxDropdownResults);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSubmit) {
        onSubmit(query);
      } else {
        // Navigate to search page
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || displayResults.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, displayResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && displayResults[selectedIndex]) {
          const item = displayResults[selectedIndex];
          const href = item.type === 'post' ? `/blog/${item.slug}` : `/${item.slug}`;
          router.push(href);
          setIsOpen(false);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    clear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (query.length >= 2 && showDropdown) {
      setIsOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2 && showDropdown) {
      setIsOpen(true);
    }
  };

  const searchTerms = query.split(/\s+/).filter(t => t.length >= 2);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <Search className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
        )} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border bg-background pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary',
            sizeClasses[size]
          )}
        />

        {/* Loading/Clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className={cn(
              'animate-spin text-muted-foreground',
              size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'
            )} />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className={size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} />
            </button>
          ) : null}
        </div>
      </form>

      {/* Active search indicator */}
      {showActiveIndicator && query && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Searching for:</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
            {query}
          </span>
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Clear
          </button>
        </div>
      )}

      {/* Dropdown Results */}
      {showDropdown && isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
            {displayResults.length === 0 && !isLoading ? (
              <div className="px-4 py-6 text-center text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="divide-y">
                {displayResults.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      'transition-colors',
                      index === selectedIndex && 'bg-muted/50'
                    )}
                  >
                    <SearchCard
                      item={item}
                      highlightTerms={searchTerms}
                      compact
                    />
                  </div>
                ))}
              </div>
            )}

            {/* View all results link */}
            {displayResults.length > 0 && (
              <div className="border-t px-4 py-2 bg-muted/30">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary hover:underline w-full text-center"
                >
                  View all results →
                </button>
              </div>
            )}

            {/* Keyboard hints */}
            <div className="border-t px-4 py-1.5 bg-muted/30 flex gap-4 text-xs text-muted-foreground">
              <span><kbd className="px-1 py-0.5 bg-background rounded text-[10px]">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 bg-background rounded text-[10px]">Enter</kbd> select</span>
              <span><kbd className="px-1 py-0.5 bg-background rounded text-[10px]">Esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
