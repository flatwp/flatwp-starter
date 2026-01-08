/**
 * Blog Archive Page
 * Displays list/grid of posts with sidebar and featured section
 */

import { Archive } from '@/components/blog';
import { getClient, GET_POSTS, GET_CATEGORIES, GET_TAGS } from '@/lib/wordpress';
import type { Post, Category, Tag } from '@/lib/wordpress';

export const revalidate = 300; // Revalidate every 5 minutes

async function getPosts() {
    try {
        const { data } = await getClient().query({
            query: GET_POSTS,
            variables: { first: 20 },
        });
        return data?.posts?.nodes || [];
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    }
}

async function getCategories() {
    try {
        const { data } = await getClient().query({
            query: GET_CATEGORIES,
        });
        return data?.categories?.nodes || [];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

async function getTags() {
    try {
        const { data } = await getClient().query({
            query: GET_TAGS,
        });
        return data?.tags?.nodes || [];
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

export default async function BlogPage() {
    const [posts, categories, tags] = await Promise.all([
        getPosts(),
        getCategories(),
        getTags(),
    ]);

    // Get recent posts for sidebar (non-sticky)
    const recentPosts = (posts as Post[])
        .filter(p => !p.isSticky)
        .slice(0, 5);

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-2">Blog</h1>
                <p className="text-muted-foreground mb-8">
                    Latest articles, insights, and updates
                </p>
            </div>

            <Archive
                posts={posts as Post[]}
                categories={categories as Category[]}
                tags={tags as Tag[]}
                recentPosts={recentPosts}
            />
        </>
    );
}
