/**
 * Search Result Card Component
 * Compact card optimized for search results - shorter than regular PostCard
 */

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, FolderOpen, FileText, Newspaper } from 'lucide-react';
import { cn, formatDate, truncateText } from '@/lib/utils';
import type { SearchableItem } from '@/lib/search/types';

interface SearchCardProps {
  item: SearchableItem;
  /** Highlight search terms in title/excerpt */
  highlightTerms?: string[];
  /** Show content type icon */
  showTypeIcon?: boolean;
  /** Compact mode for sidebar widget */
  compact?: boolean;
}

function highlightText(text: string, terms: string[]): React.ReactNode {
  if (!terms.length) return text;

  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = terms.some(term => part.toLowerCase() === term.toLowerCase());
    return isMatch ? (
      <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    );
  });
}

export function SearchCard({
  item,
  highlightTerms = [],
  showTypeIcon = true,
  compact = false,
}: SearchCardProps) {
  const href = item.type === 'post' ? `/blog/${item.slug}` : `/${item.slug}`;
  const TypeIcon = item.type === 'post' ? Newspaper : FileText;

  // Compact mode for sidebar widget
  if (compact) {
    return (
      <Link
        href={href}
        className="group flex items-start gap-3 py-2 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
      >
        {showTypeIcon && (
          <TypeIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium leading-tight group-hover:text-primary line-clamp-2">
            {highlightText(item.title, highlightTerms)}
          </h4>
          {item.categories.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {item.categories[0].name}
            </span>
          )}
        </div>
      </Link>
    );
  }

  // Full search result card
  return (
    <article className="group flex gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      {/* Featured Image */}
      {item.featuredImage && (
        <Link href={href} className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-24 overflow-hidden rounded-md">
            <Image
              src={item.featuredImage.sourceUrl}
              alt={item.featuredImage.altText || item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 96px, 128px"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Type badge and meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          {showTypeIcon && (
            <span className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium',
              item.type === 'post'
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}>
              <TypeIcon className="w-3 h-3" />
              {item.type === 'post' ? 'Post' : 'Page'}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(item.date)}
          </span>
          {item.author && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {item.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base leading-tight mb-1.5">
          <Link href={href} className="hover:text-primary">
            {highlightText(item.title, highlightTerms)}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {highlightText(truncateText(item.excerpt, 120), highlightTerms)}
        </p>

        {/* Categories & Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {item.categories.slice(0, 2).map(category => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <FolderOpen className="w-3 h-3" />
              {category.name}
            </Link>
          ))}
          {item.tags.slice(0, 2).map(tag => (
            <Link
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
