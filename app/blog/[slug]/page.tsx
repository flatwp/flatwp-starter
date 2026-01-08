/**
 * Single Blog Post Page
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { getClient, GET_POST_BY_SLUG, GET_POSTS } from '@/lib/wordpress';
import { blogConfig } from '@/lib/config';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/wordpress';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string, preview: boolean = false) {
    try {
        const { data } = await getClient().query({
            query: GET_POST_BY_SLUG,
            variables: { slug },
            context: {
                fetchOptions: {
                    cache: preview ? 'no-store' : 'default',
                },
            },
        });
        return data?.post || null;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

export async function generateStaticParams() {
    try {
        const { data } = await getClient().query({
            query: GET_POSTS,
            variables: { first: 100 },
        });

        return (data?.posts?.nodes || []).map((post: Post) => ({
            slug: post.slug,
        }));
    } catch {
        return [];
    }
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const { isEnabled: isPreview } = await draftMode();
    const post = await getPost(slug, isPreview);

    if (!post) {
        notFound();
    }

    const image = post.featuredImage?.node;
    const author = post.author?.node;
    const categories = post.categories?.nodes || [];
    const tags = post.tags?.nodes || [];

    return (
        <article className="container mx-auto max-w-3xl px-4 py-12">
            {/* Preview banner */}
            {isPreview && (
                <div className="mb-8 rounded-lg bg-yellow-100 border border-yellow-300 px-4 py-3 text-yellow-800">
                    <strong>Preview Mode:</strong> You are viewing a draft.{' '}
                    <a href="/api/exit-preview" className="underline hover:no-underline">
                        Exit Preview
                    </a>
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                {/* Categories */}
                {blogConfig.singlePost.showCategories && categories.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                href={`/blog/category/${category.slug}`}
                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                    {blogConfig.singlePost.showAuthor && author && (
                        <div className="flex items-center gap-2">
                            {author.avatar?.url && (
                                <Image
                                    src={author.avatar.url}
                                    alt={author.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            )}
                            <span>{author.name}</span>
                        </div>
                    )}
                    {blogConfig.singlePost.showDate && (
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                    )}
                </div>
            </header>

            {/* Featured image */}
            {blogConfig.singlePost.showFeaturedImage && image && (
                <div className="relative aspect-video mb-8 overflow-hidden rounded-xl">
                    <Image
                        src={image.sourceUrl}
                        alt={image.altText || post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Tags */}
            {blogConfig.singlePost.showTags && tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                    <h3 className="text-sm font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Link
                                key={tag.id}
                                href={`/blog/tag/${tag.slug}`}
                                className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Back to blog */}
            <div className="mt-12">
                <Link
                    href="/blog"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    ← Back to Blog
                </Link>
            </div>
        </article>
    );
}
