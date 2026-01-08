/**
 * Search Filters Component
 * Advanced filtering options for the search page sidebar
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, FolderOpen, Tag, FileType } from 'lucide-react';
import type { SearchFilters as SearchFiltersType } from '@/lib/search/types';
import type { Category, Tag as TagType } from '@/lib/wordpress/types';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  categories?: Category[];
  tags?: TagType[];
  className?: string;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, icon, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium text-sm">
          {icon}
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function SearchFilters({
  filters,
  onFiltersChange,
  categories = [],
  tags = [],
  className,
}: SearchFiltersProps) {
  const handleTypeChange = (type: SearchFiltersType['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const handleCategoryChange = (categorySlug: string | undefined) => {
    onFiltersChange({ ...filters, category: categorySlug });
  };

  const handleTagChange = (tagSlug: string | undefined) => {
    onFiltersChange({ ...filters, tag: tagSlug });
  };

  const handleDateFromChange = (date: string) => {
    onFiltersChange({ ...filters, dateFrom: date || undefined });
  };

  const handleDateToChange = (date: string) => {
    onFiltersChange({ ...filters, dateTo: date || undefined });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      type: 'all',
      category: undefined,
      tag: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category ||
    filters.tag ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Content Type Filter */}
      <FilterSection
        title="Content Type"
        icon={<FileType className="w-4 h-4" />}
        defaultOpen
      >
        <div className="space-y-2">
          {(['all', 'post', 'page'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type}
                checked={filters.type === type}
                onChange={() => handleTypeChange(type)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm">
                {type === 'all' ? 'All Content' : type === 'post' ? 'Posts' : 'Pages'}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Date Range Filter */}
      <FilterSection
        title="Date Range"
        icon={<Calendar className="w-4 h-4" />}
        defaultOpen
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </FilterSection>

      {/* Category Filter */}
      {categories.length > 0 && (
        <FilterSection
          title="Category"
          icon={<FolderOpen className="w-4 h-4" />}
          defaultOpen={!!filters.category}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => handleCategoryChange(undefined)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.slug}
                  checked={filters.category === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm flex-1">{category.name}</span>
                {category.count !== undefined && (
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Tag Filter */}
      {tags.length > 0 && (
        <FilterSection
          title="Tags"
          icon={<Tag className="w-4 h-4" />}
          defaultOpen={!!filters.tag}
        >
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            <button
              onClick={() => handleTagChange(undefined)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-full transition-colors',
                !filters.tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.slug}
                onClick={() => handleTagChange(tag.slug)}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-full transition-colors',
                  filters.tag === tag.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="px-4 py-3 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-1">
            {filters.type !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {filters.type === 'post' ? 'Posts' : 'Pages'}
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {categories.find(c => c.slug === filters.category)?.name || filters.category}
              </span>
            )}
            {filters.tag && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {tags.find(t => t.slug === filters.tag)?.name || filters.tag}
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                From: {filters.dateFrom}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                To: {filters.dateTo}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
