/**
 * Navigation Configuration
 * Controls navigation source (WordPress vs config) and fallback items
 */

export type NavSource = 'wordpress' | 'config';

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    badge?: string;
    children?: NavItem[];
}

export interface FooterColumn {
    title: string;
    links: { label: string; href: string }[];
}

/**
 * Menu location mappings
 * Maps frontend locations to WordPress menu locations
 * NOTE: WPGraphQL uses SCREAMING_SNAKE_CASE for enum values
 */
export const navigationConfig = {
    /**
     * Source toggle per location
     * 'wordpress' = fetch from WP GraphQL
     * 'config' = use items defined below
     */
    sources: {
        header: 'config' as const, // Use config for now to avoid GraphQL errors
        footer: 'config' as const,
        mobile: 'config' as const,
    },

    /**
     * WordPress menu locations (must match registered locations)
     * Uses SCREAMING_SNAKE_CASE format for WPGraphQL
     */
    menuLocations: {
        header: 'PRIMARY_NAV',
        footer: 'FOOTER_NAV',
        mobile: 'MOBILE_NAV',
    },

    /**
     * Fallback header navigation (when source is 'config')
     */
    header: [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ] as NavItem[],

    /**
     * Footer navigation columns (when source is 'config')
     */
    footer: {
        columns: [
            {
                title: 'Product',
                links: [
                    { label: 'Features', href: '/features' },
                    { label: 'Pricing', href: '/pricing' },
                ],
            },
            {
                title: 'Resources',
                links: [
                    { label: 'Documentation', href: '/docs' },
                    { label: 'Blog', href: '/blog' },
                ],
            },
            {
                title: 'Company',
                links: [
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                ],
            },
        ] as FooterColumn[],
    },
} as const;

export type NavigationConfig = typeof navigationConfig;
