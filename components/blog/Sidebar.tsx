/**
 * Blog Sidebar Component
 * Displays widget sections for categories, tags, and recent posts
 */

import Link from 'next/link';
import { blogConfig, layoutConfig, type SidebarPosition } from '@/lib/config';
import type { Post } from '@/lib/wordpress';
import { cn, formatDate } from '@/lib/utils';

interface SidebarProps {
    position: SidebarPosition;
    categories?: { name: string; slug: string; count?: number }[];
    tags?: { name: string; slug: string; count?: number }[];
    recentPosts?: Post[];
}

export function Sidebar({
    position,
    categories = [],
    tags = [],
    recentPosts = [],
}: SidebarProps) {
    const widgets = blogConfig.archive.sidebar.widgets;

    return (
        <aside
            className={cn(
                'flex-shrink-0 space-y-8',
                position === 'dual' ? 'w-64' : 'w-80'
            )}
            style={{ width: layoutConfig.sidebar.width }}
        >
            {/* Search widget */}
            {widgets.includes('search') && (
                <SidebarSection title="Search">
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search posts..."
                            className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <svg
                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </SidebarSection>
            )}

            {/* Categories widget */}
            {widgets.includes('categories') && categories.length > 0 && (
                <SidebarSection title="Categories">
                    <ul className="space-y-2">
                        {categories.slice(0, 10).map(category => (
                            <li key={category.slug}>
                                <Link
                                    href={`/blog/category/${category.slug}`}
                                    className="flex items-center justify-between text-sm hover:text-primary"
                                >
                                    <span>{category.name}</span>
                                    {category.count !== undefined && (
                                        <span className="text-muted-foreground">({category.count})</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarSection>
            )}

            {/* Tags widget */}
            {widgets.includes('tags') && tags.length > 0 && (
                <SidebarSection title="Tags">
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 15).map(tag => (
                            <Link
                                key={tag.slug}
                                href={`/blog/tag/${tag.slug}`}
                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </SidebarSection>
            )}

            {/* Recent posts widget */}
            {widgets.includes('recent') && recentPosts.length > 0 && (
                <SidebarSection title="Recent Posts">
                    <ul className="space-y-4">
                        {recentPosts.slice(0, 5).map(post => (
                            <li key={post.id}>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group block"
                                >
                                    <h4 className="text-sm font-medium leading-tight group-hover:text-primary line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <time
                                        dateTime={post.date}
                                        className="text-xs text-muted-foreground"
                                    >
                                        {formatDate(post.date)}
                                    </time>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarSection>
            )}
        </aside>
    );
}

function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-card p-5">
            <h3 className="font-semibold mb-4">{title}</h3>
            {children}
        </div>
    );
}
