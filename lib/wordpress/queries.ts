/**
 * WordPress GraphQL Queries
 * Simplified queries that avoid field conflicts
 * Uses renderedHtml for block content instead of complex fragment unions
 */

import { gql } from '@apollo/client';

/**
 * Get posts for blog archive
 */
export const GET_POSTS = gql`
  query GetPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        isSticky
        content
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
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
 * Get single post by slug
 */
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      excerpt
      isSticky
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;

/**
 * Get page by slug with Gutenberg blocks
 * Uses renderedHtml to avoid complex type conflicts
 * Custom FlatWP blocks have their attributes fetched separately
 */
export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      date
      modified
      uri
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      flatwpSettings {
        hideTitle
        containerWidth
        hideHeader
        hideFooter
        customCssClass
      }
      editorBlocks(flat: true) {
        name
        clientId
        parentClientId
        renderedHtml
        ... on FlatwpHero {
          attributes {
            variant
            heading
            subheading
            alignment
            primaryButtonText
            primaryButtonUrl
            primaryButtonStyle
            secondaryButtonText
            secondaryButtonUrl
            backgroundImageUrl
            overlayOpacity
            overlayColor
            gradientFrom
            gradientTo
            gradientDirection
            minHeight
            colorScheme
            sideImageUrl
            imagePosition
            className
          }
        }
        ... on FlatwpHeroMinimal {
          attributes {
            heading
            heroDescription: description
            alignment
            ctaText
            ctaUrl
            className
          }
        }
        ... on FlatwpCta {
          attributes {
            variant
            heading
            ctaDescription: text
            ctaText: buttonText
            ctaUrl: buttonUrl
            buttonStyle
            secondaryButtonText
            secondaryButtonUrl
            colorScheme
            alignment
            gradientFrom
            gradientTo
            imageUrl
            className
          }
        }
        ... on FlatwpFaq {
          attributes {
            heading
            faqSubheading: subheading
            showHeading
            colorScheme
            iconStyle
            allowMultipleOpen
            className
          }
        }
        ... on FlatwpFaqItem {
          attributes {
            question
            answer
            isOpenByDefault
          }
        }
        ... on FlatwpFeatures {
          attributes {
            heading
            featuresSubheading: subheading
            showHeading
            featuresColumns: columns
            colorScheme
            iconStyle
            className
          }
        }
        ... on FlatwpFeatureItem {
          attributes {
            icon
            title
            featureDescription: description
          }
        }
        ... on FlatwpStatistics {
          attributes {
            heading
            statsColumns: columns
            className
          }
        }
        ... on FlatwpStatItem {
          attributes {
            value
            label
          }
        }
        ... on FlatwpTeam {
          attributes {
            heading
            teamColumns: columns
            className
          }
        }
        ... on FlatwpTeamMember {
          attributes {
            name
            role
            bio
            photoUrl
            linkedin
            twitter
          }
        }
        ... on FlatwpLogoRow {
          attributes {
            heading
            logos
            displayMode
            logoRowColumns: columns
            logoSize
            alignment
            colorScheme
            className
          }
        }
        ... on FlatwpImageText {
          attributes {
            heading
            imageTextContent: content
            imageTextImageUrl: imageUrl
            imageAlt
            imagePosition
            ctaText
            ctaUrl
            className
          }
        }
        ... on FlatwpCard {
          attributes {
            colorScheme
            borderRadius
            borderStyle
            shadow
            padding
            hoverEffect
            customBackground
            customTextColor
            customBorderColor
            gradientFrom
            gradientTo
            className
          }
        }
        ... on FlatwpPricingColumn {
          attributes {
            title
            price
            period
            pricingDescription: description
            features
            ctaText
            ctaUrl
            highlighted
            highlightLabel
            className
          }
        }
        ... on FlatwpSection {
          attributes {
            colorScheme
            backgroundType
            backgroundImageUrl
            overlayOpacity
            gradientFrom
            gradientTo
            gradientDirection
            paddingTop
            paddingBottom
            containerWidth
            dividerTop
            dividerBottom
            className
          }
        }
      }
    }
  }
`;

/**
 * Get menus by location
 * Note: WPGraphQL uses SCREAMING_SNAKE_CASE for enum values
 */
export const GET_MENUS_BY_LOCATION = gql`
  query GetMenusByLocation($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }, first: 50) {
      nodes {
        id
        title: label
        url
        parentId
        flatwpIcon
        flatwpBadge
      }
    }
  }
`;

/**
 * Get all categories
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

/**
 * Get all tags
 */
export const GET_TAGS = gql`
  query GetTags {
    tags(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;
