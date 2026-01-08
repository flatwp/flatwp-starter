/**
 * Featured Posts Component
 * Displays sticky/featured posts in a prominent layout
 */

import Link from 'next/link';
import Image from 'next/image';
import { blogConfig } from '@/lib/config';
import { cn, formatDate } from '@/lib/utils';
import type { Post } from '@/lib/wordpress';

interface FeaturedPostsProps {
    posts: Post[];
    layout?: 'horizontal' | 'vertical' | 'hero';
}

export function FeaturedPosts({
    posts,
    layout = blogConfig.archive.featured.layout,
}: FeaturedPostsProps) {
    if (posts.length === 0) return null;

    // Hero layout: one large post
    if (layout === 'hero' && posts.length >= 1) {
        const [main, ...others] = posts;
        return (
            <div className="grid gap-6 lg:grid-cols-2">
                <FeaturedCard post={main} size="large" />
                {others.length > 0 && (
                    <div className="grid gap-4">
                        {others.map(post => (
                            <FeaturedCard key={post.id} post={post} size="small" />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Horizontal layout: posts in a row
    if (layout === 'horizontal') {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <FeaturedCard key={post.id} post={post} size="medium" />
                ))}
            </div>
        );
    }

    // Vertical layout: posts stacked
    return (
        <div className="space-y-6">
            {posts.map(post => (
                <FeaturedCard key={post.id} post={post} size="wide" />
            ))}
        </div>
    );
}

interface FeaturedCardProps {
    post: Post;
    size: 'small' | 'medium' | 'large' | 'wide';
}

function FeaturedCard({ post, size }: FeaturedCardProps) {
    const image = post.featuredImage?.node;
    const categories = post.categories?.nodes || [];

    const sizeClasses = {
        small: 'aspect-video',
        medium: 'aspect-[4/3]',
        large: 'aspect-[4/3] lg:aspect-video',
        wide: 'aspect-[3/1] md:aspect-[4/1]',
    };

    return (
        <article className={cn(
            'group relative overflow-hidden rounded-xl',
            size === 'large' && 'lg:row-span-2'
        )}>
            {/* Background image */}
            {image && (
                <div className={cn('relative w-full', sizeClasses[size])}>
                    <Image
                        src={image.sourceUrl}
                        alt={image.altText || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={size === 'large'}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                {/* Category badge */}
                {categories.length > 0 && (
                    <Link
                        href={`/blog/category/${categories[0].slug}`}
                        className="inline-block self-start rounded-full bg-primary px-3 py-1 text-xs font-medium mb-3 hover:bg-primary/90"
                    >
                        {categories[0].name}
                    </Link>
                )}

                {/* Title */}
                <h3 className={cn(
                    'font-bold leading-tight',
                    size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl lg:text-3xl' : 'text-xl'
                )}>
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                    </Link>
                </h3>

                {/* Meta */}
                <div className={cn(
                    'mt-2 text-white/80',
                    size === 'small' ? 'text-xs' : 'text-sm'
                )}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
            </div>
        </article>
    );
}
