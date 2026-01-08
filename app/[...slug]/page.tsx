/**
 * Dynamic Page Route
 * Renders WordPress pages with Gutenberg blocks
 */

import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { getClient, GET_PAGE_BY_SLUG } from '@/lib/wordpress';
import { EditorBlockRenderer } from '@/components/blocks';
import type { Page, EditorBlock } from '@/lib/wordpress';

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

async function getPage(slug: string, preview: boolean = false) {
    try {
        const { data } = await getClient().query<{ page: Page | null }>({
            query: GET_PAGE_BY_SLUG,
            variables: { slug: `/${slug}` },
            context: {
                fetchOptions: {
                    cache: preview ? 'no-store' : 'default',
                },
            },
        });
        return data?.page || null;
    } catch (error) {
        // If editorBlocks query fails, try simple page query
        console.warn('Full page query failed, trying fallback:', error);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query GetPageSimple($slug: ID!) {
                            page(id: $slug, idType: URI) {
                                id
                                title
                                slug
                                content
                                uri
                            }
                        }
                    `,
                    variables: { slug: `/${slug}` },
                }),
                cache: preview ? 'no-store' : 'default',
            });
            const result = await response.json();
            return result?.data?.page || null;
        } catch (fallbackError) {
            console.error('Fallback page query also failed:', fallbackError);
            return null;
        }
    }
}

export const revalidate = 3600; // Revalidate every hour

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const slugPath = slug?.join('/') || '';

    // Handle homepage
    if (!slugPath) {
        // Homepage is handled by app/page.tsx
        notFound();
    }

    const { isEnabled: isPreview } = await draftMode();
    const page = await getPage(slugPath, isPreview);

    if (!page) {
        notFound();
    }

    const blocks = (page.editorBlocks || []) as EditorBlock[];

    return (
        <div className="min-h-screen">
            {/* Preview banner */}
            {isPreview && (
                <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-yellow-800 text-center">
                    <strong>Preview Mode:</strong> You are viewing a draft.{' '}
                    <a href="/api/exit-preview" className="underline hover:no-underline">
                        Exit Preview
                    </a>
                </div>
            )}

            {/* Page title (if no blocks, show title and content) */}
            {blocks.length === 0 && (
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
                    {page.content && (
                        <div
                            className="prose prose-lg prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    )}
                </div>
            )}

            {/* Render blocks */}
            {blocks.length > 0 && (
                <EditorBlockRenderer blocks={blocks} />
            )}
        </div>
    );
}
