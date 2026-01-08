/**
 * Search API Route
 * Handles search queries against WordPress GraphQL with filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { siteConfig } from '@/lib/config';
import { SEARCH_ALL, SEARCH_POSTS, SEARCH_PAGES, SEARCH_POSTS_BY_CATEGORY, SEARCH_POSTS_BY_TAG } from '@/lib/search/queries';
import type { SearchableItem, SearchResponse, SearchFilters } from '@/lib/search/types';
import { stripHtml, truncateText } from '@/lib/utils';

// Create a standalone Apollo Client for API routes
function createClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: siteConfig.wordpress.graphqlEndpoint,
      fetch,
    }),
  });
}

interface WPPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author?: {
    node: {
      name: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
  tags?: {
    nodes: Array<{ name: string; slug: string }>;
  };
}

interface WPPage {
  id: string;
  title: string;
  slug: string;
  date: string;
  content?: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

interface PostsQueryResponse {
  posts: {
    nodes: WPPost[];
    pageInfo: PageInfo;
  };
}

interface PagesQueryResponse {
  pages: {
    nodes: WPPage[];
    pageInfo: PageInfo;
  };
}

interface SearchAllQueryResponse {
  posts: {
    nodes: WPPost[];
    pageInfo: PageInfo;
  };
  pages: {
    nodes: WPPage[];
    pageInfo: PageInfo;
  };
}

function transformPost(post: WPPost): SearchableItem {
  const plainExcerpt = post.excerpt ? stripHtml(post.excerpt) : '';
  const plainContent = post.content ? stripHtml(post.content) : '';

  return {
    id: post.id,
    type: 'post',
    title: post.title,
    slug: post.slug,
    excerpt: plainExcerpt || truncateText(plainContent, 150),
    date: post.date,
    categories: post.categories?.nodes || [],
    tags: post.tags?.nodes || [],
    author: post.author?.node?.name,
    featuredImage: post.featuredImage?.node,
  };
}

function transformPage(page: WPPage): SearchableItem {
  const plainContent = page.content ? stripHtml(page.content) : '';

  return {
    id: page.id,
    type: 'page',
    title: page.title,
    slug: page.slug,
    excerpt: truncateText(plainContent, 150),
    date: page.date,
    categories: [],
    tags: [],
  };
}

// Filter results by date range client-side
function filterByDateRange(
  items: SearchableItem[],
  dateFrom?: string,
  dateTo?: string
): SearchableItem[] {
  if (!dateFrom && !dateTo) return items;

  return items.filter(item => {
    const itemDate = new Date(item.date);
    if (dateFrom && itemDate < new Date(dateFrom)) return false;
    if (dateTo && itemDate > new Date(dateTo)) return false;
    return true;
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type') as SearchFilters['type'] | null;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const postsAfter = searchParams.get('postsAfter');
  const pagesAfter = searchParams.get('pagesAfter');

  // Validate query
  if (!query || query.length < 2) {
    return NextResponse.json<SearchResponse>(
      {
        results: [],
        total: 0,
        query: query || '',
        filters: { type: type || 'all' },
        hasMore: false,
      },
      { status: 200 }
    );
  }

  const client = createClient();
  const filters: SearchFilters = {
    type: type || 'all',
    category: category || undefined,
    tag: tag || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  try {
    let results: SearchableItem[] = [];
    let hasMorePosts = false;
    let hasMorePages = false;
    let postsEndCursor: string | undefined;
    let pagesEndCursor: string | undefined;

    // Determine which query to use based on filters
    if (type === 'post' || type === 'all' || !type) {
      if (category) {
        // Search posts by category
        const { data } = await client.query<PostsQueryResponse>({
          query: SEARCH_POSTS_BY_CATEGORY,
          variables: {
            search: query,
            categorySlug: category,
            first: limit,
            after: postsAfter,
          },
        });

        const posts = data?.posts?.nodes || [];
        results.push(...posts.map(transformPost));
        hasMorePosts = data?.posts?.pageInfo?.hasNextPage || false;
        postsEndCursor = data?.posts?.pageInfo?.endCursor;
      } else if (tag) {
        // Search posts by tag
        const { data } = await client.query<PostsQueryResponse>({
          query: SEARCH_POSTS_BY_TAG,
          variables: {
            search: query,
            tagSlug: tag,
            first: limit,
            after: postsAfter,
          },
        });

        const posts = data?.posts?.nodes || [];
        results.push(...posts.map(transformPost));
        hasMorePosts = data?.posts?.pageInfo?.hasNextPage || false;
        postsEndCursor = data?.posts?.pageInfo?.endCursor;
      } else if (type === 'post') {
        // Search posts only
        const { data } = await client.query<PostsQueryResponse>({
          query: SEARCH_POSTS,
          variables: {
            search: query,
            first: limit,
            after: postsAfter,
          },
        });

        const posts = data?.posts?.nodes || [];
        results.push(...posts.map(transformPost));
        hasMorePosts = data?.posts?.pageInfo?.hasNextPage || false;
        postsEndCursor = data?.posts?.pageInfo?.endCursor;
      } else {
        // Search all (posts and pages)
        const { data } = await client.query<SearchAllQueryResponse>({
          query: SEARCH_ALL,
          variables: {
            search: query,
            first: limit,
            postsAfter,
            pagesAfter,
          },
        });

        const posts = data?.posts?.nodes || [];
        const pages = data?.pages?.nodes || [];

        results.push(...posts.map(transformPost));
        results.push(...pages.map(transformPage));

        hasMorePosts = data?.posts?.pageInfo?.hasNextPage || false;
        hasMorePages = data?.pages?.pageInfo?.hasNextPage || false;
        postsEndCursor = data?.posts?.pageInfo?.endCursor;
        pagesEndCursor = data?.pages?.pageInfo?.endCursor;
      }
    } else if (type === 'page') {
      // Search pages only
      const { data } = await client.query<PagesQueryResponse>({
        query: SEARCH_PAGES,
        variables: {
          search: query,
          first: limit,
          after: pagesAfter,
        },
      });

      const pages = data?.pages?.nodes || [];
      results.push(...pages.map(transformPage));
      hasMorePages = data?.pages?.pageInfo?.hasNextPage || false;
      pagesEndCursor = data?.pages?.pageInfo?.endCursor;
    }

    // Apply date range filter client-side
    results = filterByDateRange(results, dateFrom || undefined, dateTo || undefined);

    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const response: SearchResponse = {
      results,
      total: results.length,
      query,
      filters,
      hasMore: hasMorePosts || hasMorePages,
      endCursor: postsEndCursor || pagesEndCursor,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        total: 0,
        query,
        filters,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
