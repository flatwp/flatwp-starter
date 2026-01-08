/**
 * Header Component
 * Supports both WordPress menu and config-based navigation
 */

import Link from 'next/link';
import { navigationConfig, siteConfig } from '@/lib/config';
import { getClient, GET_MENUS_BY_LOCATION, type MenuItem } from '@/lib/wordpress';
import { cn } from '@/lib/utils';
import { HeaderSearchButton } from '@/components/search/HeaderSearchButton';

async function getNavItems() {
    if (navigationConfig.sources.header === 'config') {
        return navigationConfig.header;
    }

    try {
        const { data } = await getClient().query<{ menuItems: { nodes: MenuItem[] } }>({
            query: GET_MENUS_BY_LOCATION,
            variables: { location: navigationConfig.menuLocations.header },
        });

        const menuItems = data?.menuItems?.nodes || [];
        return menuItems.map((item: MenuItem) => ({
            label: item.title,
            href: item.url,
            icon: item.flatwpIcon,
            badge: item.flatwpBadge,
        }));
    } catch (error) {
        console.error('Failed to fetch menu:', error);
        return navigationConfig.header; // Fallback to config
    }
}

export async function Header() {
    const navItems = await getNavItems();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{siteConfig.name}</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                'text-muted-foreground'
                            )}
                        >
                            {item.label}
                            {item.badge && (
                                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Search Button */}
                    <HeaderSearchButton />
                </nav>

                {/* Mobile menu button placeholder */}
                <button className="md:hidden p-2">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}
