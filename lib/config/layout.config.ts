/**
 * Layout Configuration
 * Controls page widths, sidebar modes, and responsive breakpoints
 */

export type PageWidth = 'narrow' | 'default' | 'wide' | 'full';
export type SidebarMode = 'left' | 'right' | 'dual' | 'none';

export const layoutConfig = {
    /**
     * Page width definitions (max-width values)
     */
    pageWidths: {
        narrow: '768px',
        default: '1024px',
        wide: '1280px',
        full: '100%',
    },

    /**
     * Default page layout (for generic pages)
     */
    defaultLayout: {
        width: 'default' as PageWidth,
        sidebar: 'none' as SidebarMode,
        containerPadding: 'px-4 md:px-6 lg:px-8',
    },

    /**
     * Blog archive layout
     */
    blogLayout: {
        width: 'wide' as PageWidth,
        sidebar: 'right' as SidebarMode,
    },

    /**
     * Single blog post layout
     */
    singlePostLayout: {
        width: 'default' as PageWidth,
        sidebar: 'none' as SidebarMode,
    },

    /**
     * Sidebar dimensions
     */
    sidebar: {
        width: '280px',
        wideWidth: '320px',
        gap: '2rem',
    },

    /**
     * Header settings
     */
    header: {
        sticky: true,
        transparent: false,
        height: '64px',
    },

    /**
     * Footer settings
     */
    footer: {
        showSocialLinks: true,
        showCopyright: true,
        copyrightText: '© {year} FlatWP Starter. All rights reserved.',
    },
} as const;

export type LayoutConfig = typeof layoutConfig;
