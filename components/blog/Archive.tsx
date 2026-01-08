/**
 * Archive Component
 * Configurable blog post listing with layout, sidebar, and pagination options
 */

import { blogConfig, layoutConfig, type SidebarPosition } from '@/lib/config';
import type { Post } from '@/lib/wordpress';
import { PostCard } from './PostCard';
import { FeaturedPosts } from './FeaturedPosts';
import { Sidebar } from './Sidebar';
import { Pagination } from './Pagination';
import { cn } from '@/lib/utils';

export interface ArchiveProps {
    posts: Post[];
    /** Override: layout type */
    layout?: 'list' | 'grid';
    /** Override: sidebar position */
    sidebar?: SidebarPosition;
    /** Override: show featured posts at top */
    showFeatured?: boolean;
    /** Override: grid columns (only for grid layout) */
    columns?: { sm?: number; md?: number; lg?: number };
    /** Override: pagination style */
    paginationStyle?: 'numbered' | 'load-more' | 'infinite';
    /** Current page (for pagination) */
    currentPage?: number;
    /** Total pages (for pagination) */
    totalPages?: number;
    /** Categories for sidebar */
    categories?: { name: string; slug: string; count?: number }[];
    /** Tags for sidebar */
    tags?: { name: string; slug: string; count?: number }[];
    /** Recent posts for sidebar */
    recentPosts?: Post[];
}

export function Archive({
    posts,
    layout = blogConfig.archive.defaultLayout,
    sidebar = blogConfig.archive.sidebar.position,
    showFeatured = blogConfig.archive.featured.enabled,
    columns = blogConfig.grid.columns,
    paginationStyle = blogConfig.pagination.style,
    currentPage = 1,
    totalPages = 1,
    categories = [],
    tags = [],
    recentPosts = [],
}: ArchiveProps) {
    // Separate featured (sticky) posts
    const featuredPosts = showFeatured
        ? posts.filter(p => p.isSticky).slice(0, blogConfig.archive.featured.max)
        : [];
    const regularPosts = showFeatured
        ? posts.filter(p => !p.isSticky)
        : posts;

    // Only show featured on first page
    const showFeaturedSection = showFeatured
        && featuredPosts.length > 0
        && (currentPage === 1 || !blogConfig.archive.featured.showOnFirstPageOnly);

    // Grid column classes
    const gridClasses = cn(
        'grid',
        columns.sm === 1 ? 'grid-cols-1' : `grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        `gap-${blogConfig.grid.gap}`
    );

    // Layout width
    const widthClass = `max-w-[${sidebar !== 'none'
            ? layoutConfig.pageWidths.wide
            : layoutConfig.pageWidths.default
        }]`;

    return (
        <div className={cn('container mx-auto px-4 py-8', widthClass)}>
            {/* Featured posts */}
            {showFeaturedSection && (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Featured</h2>
                    <FeaturedPosts posts={featuredPosts} />
                </section>
            )}

            {/* Main content area with optional sidebar */}
            <div className={cn(
                'flex gap-8',
                sidebar === 'left' && 'flex-row-reverse',
                sidebar === 'dual' && 'justify-between'
            )}>
                {/* Posts */}
                <div className={cn(
                    'flex-1 min-w-0',
                    sidebar !== 'none' && 'max-w-[calc(100%-320px-2rem)]'
                )}>
                    <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>

                    {layout === 'grid' ? (
                        <div className={gridClasses}>
                            {regularPosts.map(post => (
                                <PostCard key={post.id} post={post} layout="grid" />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {regularPosts.map(post => (
                                <PostCard key={post.id} post={post} layout="list" />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            style={paginationStyle}
                        />
                    )}
                </div>

                {/* Sidebar */}
                {sidebar !== 'none' && (
                    <Sidebar
                        position={sidebar}
                        categories={categories}
                        tags={tags}
                        recentPosts={recentPosts}
                    />
                )}
            </div>
        </div>
    );
}
