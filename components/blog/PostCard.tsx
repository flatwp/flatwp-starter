/**
 * Post Card Component
 * Configurable card for displaying blog posts in list or grid layouts
 */

import Link from 'next/link';
import Image from 'next/image';
import { blogConfig } from '@/lib/config';
import { cn, formatDate, stripHtml, truncateText } from '@/lib/utils';
import type { Post } from '@/lib/wordpress';

// Aspect ratio class mapping
const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    '1:1': 'aspect-square',
};

// Hover effect classes
const hoverEffectClasses = {
    none: '',
    lift: 'hover:-translate-y-1 transition-transform duration-200',
    glow: 'hover:ring-2 hover:ring-primary/20 transition-shadow duration-200',
};

export interface PostCardProps {
    post: Post;
    /** Override: list or grid display */
    layout?: 'list' | 'grid';
    /** Override: show featured image */
    showImage?: boolean;
    /** Override: image aspect ratio */
    imageAspectRatio?: keyof typeof aspectRatioClasses;
    /** Override: show meta info */
    showMeta?: boolean;
    /** Override: show excerpt */
    showExcerpt?: boolean;
    /** Override: excerpt length */
    excerptLength?: number;
    /** Override: hover effect */
    hoverEffect?: 'none' | 'lift' | 'glow';
    /** Featured post styling */
    featured?: boolean;
}

export function PostCard({
    post,
    layout = 'list',
    showImage = blogConfig.card.showFeaturedImage,
    imageAspectRatio = blogConfig.card.imageAspectRatio,
    showMeta = blogConfig.card.showMeta,
    showExcerpt = blogConfig.card.showExcerpt,
    excerptLength = blogConfig.card.excerptLength,
    hoverEffect = blogConfig.card.hoverEffect,
    featured = false,
}: PostCardProps) {
    const excerpt = post.excerpt
        ? truncateText(stripHtml(post.excerpt), excerptLength)
        : '';
    const image = post.featuredImage?.node;
    const author = post.author?.node;
    const categories = post.categories?.nodes || [];

    // Grid layout: vertical card
    if (layout === 'grid') {
        return (
            <article
                className={cn(
                    'group rounded-lg border bg-card overflow-hidden',
                    hoverEffectClasses[hoverEffect],
                    featured && 'ring-2 ring-primary'
                )}
            >
                {/* Image */}
                {showImage && image && (
                    <Link href={`/blog/${post.slug}`} className="block">
                        <div className={cn('relative w-full overflow-hidden', aspectRatioClasses[imageAspectRatio])}>
                            <Image
                                src={image.sourceUrl}
                                alt={image.altText || post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    </Link>
                )}

                {/* Content */}
                <div className="p-5">
                    {/* Meta */}
                    {showMeta && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                            {categories.length > 0 && (
                                <>
                                    <span>•</span>
                                    <Link
                                        href={`/blog/category/${categories[0].slug}`}
                                        className="hover:text-primary"
                                    >
                                        {categories[0].name}
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="font-semibold text-lg leading-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                            {post.title}
                        </Link>
                    </h2>

                    {/* Excerpt */}
                    {showExcerpt && excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {excerpt}
                        </p>
                    )}

                    {/* Read more */}
                    {blogConfig.card.showReadMore && (
                        <Link
                            href={`/blog/${post.slug}`}
                            className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                        >
                            Read more →
                        </Link>
                    )}
                </div>
            </article>
        );
    }

    // List layout: horizontal card
    return (
        <article
            className={cn(
                'group flex gap-6 py-6 border-b last:border-b-0',
                hoverEffectClasses[hoverEffect],
                featured && 'bg-muted/50 -mx-4 px-4 rounded-lg border'
            )}
        >
            {/* Image */}
            {showImage && image && (
                <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
                    <div className={cn('relative w-48 overflow-hidden rounded-lg', aspectRatioClasses[imageAspectRatio])}>
                        <Image
                            src={image.sourceUrl}
                            alt={image.altText || post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Meta */}
                {showMeta && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        {author && (
                            <>
                                <span>{author.name}</span>
                                <span>•</span>
                            </>
                        )}
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        {categories.length > 0 && (
                            <>
                                <span>•</span>
                                <Link
                                    href={`/blog/category/${categories[0].slug}`}
                                    className="hover:text-primary"
                                >
                                    {categories[0].name}
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Title */}
                <h2 className="font-semibold text-xl leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                        {post.title}
                    </Link>
                </h2>

                {/* Excerpt */}
                {showExcerpt && excerpt && (
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                        {excerpt}
                    </p>
                )}

                {/* Read more */}
                {blogConfig.card.showReadMore && (
                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
                    >
                        Read more →
                    </Link>
                )}
            </div>
        </article>
    );
}
