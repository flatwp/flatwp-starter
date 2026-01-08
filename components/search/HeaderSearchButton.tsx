/**
 * Header Search Button Component
 * A search button for the header that opens a search modal
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Command } from 'lucide-react';
import { useSearch } from '@/lib/search/useSearch';
import { SearchCard } from './SearchCard';
import { cn } from '@/lib/utils';

interface HeaderSearchButtonProps {
  className?: string;
}

export function HeaderSearchButton({ className }: HeaderSearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50 hover:bg-muted transition-colors text-muted-foreground text-sm',
          className
        )}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background rounded text-[10px] border">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <SearchModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.focus();
  }, []);

  const {
    query,
    setQuery,
    results,
    isLoading,
    clear,
  } = useSearch({
    debounceMs: 200,
    minChars: 2,
    resultsPerPage: 8,
    autoSearch: true,
  });

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          const item = results[selectedIndex];
          const href = item.type === 'post' ? `/blog/${item.slug}` : `/${item.slug}`;
          router.push(href);
          onClose();
        } else if (query.length >= 2) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const navigateToResult = (index: number) => {
    const item = results[index];
    if (item) {
      const href = item.type === 'post' ? `/blog/${item.slug}` : `/${item.slug}`;
      router.push(href);
      onClose();
    }
  };

  const searchTerms = query.split(/\s+/).filter(t => t.length >= 2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center pt-[15vh]">
        <div className="w-full max-w-xl mx-4 bg-card rounded-xl shadow-2xl border overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center border-b px-4">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts and pages..."
              className="flex-1 px-4 py-4 text-lg bg-transparent outline-none"
            />
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin flex-shrink-0" />
            ) : query ? (
              <button
                onClick={() => clear()}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.length >= 2 && results.length === 0 && !isLoading && (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => navigateToResult(index)}
                    className={cn(
                      'w-full text-left px-2 transition-colors',
                      index === selectedIndex && 'bg-muted/50'
                    )}
                  >
                    <SearchCard
                      item={item}
                      highlightTerms={searchTerms}
                      compact
                      showTypeIcon
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="border-t px-4 py-2 bg-muted/30">
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  onClose();
                }}
                className="text-sm text-primary hover:underline w-full text-center"
              >
                View all results →
              </button>
            </div>
          )}

          {/* Keyboard hints */}
          <div className="border-t px-4 py-2 bg-muted/30 flex gap-4 text-xs text-muted-foreground">
            <span><kbd className="px-1.5 py-0.5 bg-background rounded">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded">Enter</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 bg-background rounded">Esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
