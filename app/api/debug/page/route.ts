/**
 * Debug API Route - Page Query
 * Tests the GraphQL page query to help diagnose issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug') || 'about';
    const uri = `/${slug}`;
    const endpoint = siteConfig.wordpress.graphqlEndpoint;

    console.log(`[Debug] Testing page query for slug: ${slug}, uri: ${uri}`);
    console.log(`[Debug] GraphQL endpoint: ${endpoint}`);

    // Simple fetch with timeout to test connectivity
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const query = `
            query GetPageBySlug($slug: ID!) {
                page(id: $slug, idType: URI) {
                    id
                    title
                    slug
                    content
                    uri
                    editorBlocks(flat: true) {
                        name
                        clientId
                        renderedHtml
                    }
                }
            }
        `;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { slug: uri } }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await response.json();

        const page = data?.data?.page || null;
        return NextResponse.json({
            success: true,
            endpoint,
            queryVariables: { slug: uri },
            page: page ? {
                id: page.id,
                title: page.title,
                slug: page.slug,
                uri: page.uri,
                hasContent: !!page.content,
                editorBlocksCount: page.editorBlocks?.length || 0,
                editorBlocks: page.editorBlocks || [],
            } : null,
            errors: data?.errors || null,
        }, { status: 200 });
    } catch (error) {
        clearTimeout(timeout);
        console.error('[Debug] Page query failed:', error);

        const isTimeout = error instanceof Error && error.name === 'AbortError';

        return NextResponse.json({
            success: false,
            endpoint,
            queryVariables: { slug: uri },
            error: isTimeout
                ? `Connection timeout after 5s - Next.js server cannot reach ${endpoint}`
                : (error instanceof Error ? error.message : 'Unknown error'),
            hint: isTimeout
                ? 'If WordPress is in Docker, use http://localhost:8080/graphql for local Next.js dev'
                : null,
        }, { status: 500 });
    }
}
