/**
 * Site Configuration
 * Core site metadata, branding, and SEO defaults
 */

export const siteConfig = {
    // Site identity
    name: 'FlatWP Starter',
    description: 'Modern headless WordPress with Next.js',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

    // Branding
    logo: {
        src: '/logo.svg',
        width: 120,
        height: 32,
        alt: 'Site Logo',
    },
    favicon: '/favicon.ico',

    // SEO defaults
    seo: {
        titleTemplate: '%s | FlatWP Starter',
        defaultTitle: 'FlatWP Starter',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            siteName: 'FlatWP Starter',
        },
    },

    // Social links (displayed in footer)
    social: {
        twitter: '',
        github: '',
        linkedin: '',
    },

    // WordPress connection
    wordpress: {
        graphqlEndpoint: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '',
        secret: process.env.FLATWP_SECRET || '',
    },
} as const;

export type SiteConfig = typeof siteConfig;
