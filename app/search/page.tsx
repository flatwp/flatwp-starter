/**
 * Search Page
 * Dedicated search page with advanced filters and paginated results
 */

import { Suspense } from 'react';
import { getClient, GET_CATEGORIES, GET_TAGS } from '@/lib/wordpress';
import type { Category, Tag } from '@/lib/wordpress';
import { SearchPageContent } from './SearchPageContent';

export const revalidate = 300; // Revalidate every 5 minutes

async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await getClient().query<{ categories: { nodes: Category[] } }>({
      query: GET_CATEGORIES,
    });
    return data?.categories?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

async function getTags(): Promise<Tag[]> {
  try {
    const { data } = await getClient().query<{ tags: { nodes: Tag[] } }>({
      query: GET_TAGS,
    });
    return data?.tags?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

export default async function SearchPage() {
  const [categories, tags] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground">
          Find posts, pages, and content across the site
        </p>
      </div>

      {/* Search Content */}
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageContent categories={categories} tags={tags} />
      </Suspense>
    </div>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar skeleton */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="rounded-lg border bg-card h-96 animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className="flex-1 space-y-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="h-24 bg-muted rounded-lg animate-pulse" />
        <div className="h-24 bg-muted rounded-lg animate-pulse" />
        <div className="h-24 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Search',
  description: 'Search posts, pages, and content across the site',
};
