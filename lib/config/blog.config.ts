/**
 * Blog Configuration
 * Controls archive layouts, post cards, pagination, and sidebar widgets
 */

export type ArchiveLayout = 'list' | 'grid';
export type SidebarPosition = 'left' | 'right' | 'none';
export type PaginationStyle = 'numbered' | 'load-more' | 'infinite';
export type ImageAspectRatio = '16:9' | '4:3' | '1:1' | '3:2';

export const blogConfig = {
    /**
     * Archive settings (global defaults, can be overridden per-component)
     */
    archive: {
        defaultLayout: 'list' as ArchiveLayout,
        postsPerPage: 10,

        // Featured/sticky posts section
        featured: {
            enabled: true,
            layout: 'horizontal' as 'horizontal' | 'vertical' | 'hero',
            max: 3,
            showOnFirstPageOnly: true,
        },

        // Sidebar configuration
        sidebar: {
            position: 'right' as SidebarPosition,
            width: '320px',
            widgets: ['search', 'categories', 'tags', 'recent'] as const,
        },
    },

    /**
     * Grid layout settings
     */
    grid: {
        columns: { sm: 1, md: 2, lg: 3 },
        gap: 6, // Tailwind spacing units
    },

    /**
     * List layout settings
     */
    list: {
        showExcerpt: true,
        excerptLength: 150,
        showFeaturedImage: true,
    },

    /**
     * Post card settings
     */
    card: {
        showFeaturedImage: true,
        imageAspectRatio: '16:9' as ImageAspectRatio,
        showMeta: true,
        metaItems: ['date', 'author', 'categories'] as const,
        showExcerpt: true,
        excerptLength: 120,
        showReadMore: true,
        hoverEffect: 'lift' as 'none' | 'lift' | 'glow',
    },

    /**
     * Pagination settings
     */
    pagination: {
        style: 'numbered' as PaginationStyle,
        showPrevNext: true,
        maxVisiblePages: 5,
        scrollToTop: true,
    },

    /**
     * Single post settings
     */
    singlePost: {
        showFeaturedImage: true,
        showAuthor: true,
        showDate: true,
        showCategories: true,
        showTags: true,
        showShareButtons: true,
        showRelatedPosts: true,
        relatedPostsCount: 3,
    },
} as const;

export type BlogConfig = typeof blogConfig;
