import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Image optimization
    images: {
        remotePatterns: [
            // WordPress.com CDN
            { protocol: 'https', hostname: '**.wordpress.com' },
            { protocol: 'https', hostname: '**.wp.com' },
            // Gravatar
            { protocol: 'https', hostname: '**.gravatar.com' },
            // Common WP image proxies
            { protocol: 'https', hostname: 'i0.wp.com' },
            { protocol: 'https', hostname: 'i1.wp.com' },
            { protocol: 'https', hostname: 'i2.wp.com' },
            { protocol: 'https', hostname: 'i3.wp.com' },
            // Unsplash for demo images
            { protocol: 'https', hostname: 'images.unsplash.com' },
            // Auto-detect WordPress domain from API URL
            ...(process.env.NEXT_PUBLIC_WORDPRESS_API_URL
                ? (() => {
                    try {
                        const url = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
                        return [{ protocol: url.protocol.replace(':', '') as 'http' | 'https', hostname: url.hostname }];
                    } catch {
                        return [];
                    }
                })()
                : []),
            // Local development
            ...(process.env.NODE_ENV === 'development'
                ? [
                    { protocol: 'http' as const, hostname: 'localhost' },
                    { protocol: 'http' as const, hostname: '127.0.0.1' },
                ]
                : []),
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },

    // Performance
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    compress: true,
    serverExternalPackages: ['sharp'],

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
        ];
    },

    trailingSlash: false,
};

export default nextConfig;
