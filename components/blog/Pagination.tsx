/**
 * Pagination Component
 * Configurable pagination with numbered, load-more, and infinite styles
 */

'use client';

import Link from 'next/link';
import { blogConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    style?: 'numbered' | 'load-more' | 'infinite';
    basePath?: string;
    onLoadMore?: () => void;
}

export function Pagination({
    currentPage,
    totalPages,
    style = blogConfig.pagination.style,
    basePath = '/blog',
    onLoadMore,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Load more style
    if (style === 'load-more') {
        if (currentPage >= totalPages) return null;

        return (
            <div className="mt-12 flex justify-center">
                <button
                    onClick={onLoadMore}
                    className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Load More Posts
                </button>
            </div>
        );
    }

    // Infinite scroll placeholder (would need intersection observer)
    if (style === 'infinite') {
        if (currentPage >= totalPages) {
            return (
                <p className="mt-12 text-center text-muted-foreground">
                    No more posts to load
                </p>
            );
        }
        return (
            <div className="mt-12 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
        );
    }

    // Numbered pagination
    const { maxVisiblePages, showPrevNext } = blogConfig.pagination;

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    // Add first page
    if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis');
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    // Add last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis');
        pages.push(totalPages);
    }

    const getPageUrl = (page: number) => {
        if (page === 1) return basePath;
        return `${basePath}/page/${page}`;
    };

    return (
        <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
        >
            {/* Previous */}
            {showPrevNext && (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        currentPage === 1
                            ? 'pointer-events-none text-muted-foreground'
                            : 'hover:bg-muted'
                    )}
                    aria-disabled={currentPage === 1}
                >
                    Previous
                </Link>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                                …
                            </span>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <Link
                            key={page}
                            href={getPageUrl(page)}
                            className={cn(
                                'min-w-[40px] rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next */}
            {showPrevNext && (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        currentPage === totalPages
                            ? 'pointer-events-none text-muted-foreground'
                            : 'hover:bg-muted'
                    )}
                    aria-disabled={currentPage === totalPages}
                >
                    Next
                </Link>
            )}
        </nav>
    );
}
