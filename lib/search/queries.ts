/**
 * Search GraphQL Queries
 * Uses WordPress GraphQL's built-in search functionality
 */

import { gql } from '@apollo/client';

/**
 * Search posts with full-text search
 */
export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { search: $search, status: PUBLISH }
    ) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Search pages with full-text search
 */
export const SEARCH_PAGES = gql`
  query SearchPages($search: String!, $first: Int = 10, $after: String) {
    pages(
      first: $first
      after: $after
      where: { search: $search, status: PUBLISH }
    ) {
      nodes {
        id
        title
        slug
        date
        content
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Search all content types simultaneously
 */
export const SEARCH_ALL = gql`
  query SearchAll($search: String!, $first: Int = 10, $postsAfter: String, $pagesAfter: String) {
    posts(
      first: $first
      after: $postsAfter
      where: { search: $search, status: PUBLISH }
    ) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    pages(
      first: $first
      after: $pagesAfter
      where: { search: $search, status: PUBLISH }
    ) {
      nodes {
        id
        title
        slug
        date
        content
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Search posts by category
 */
export const SEARCH_POSTS_BY_CATEGORY = gql`
  query SearchPostsByCategory($search: String!, $categorySlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: {
        search: $search
        status: PUBLISH
        categoryName: $categorySlug
      }
    ) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Search posts by tag
 */
export const SEARCH_POSTS_BY_TAG = gql`
  query SearchPostsByTag($search: String!, $tagSlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: {
        search: $search
        status: PUBLISH
        tag: $tagSlug
      }
    ) {
      nodes {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
