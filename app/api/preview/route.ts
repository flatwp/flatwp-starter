/**
 * Preview API Route
 * Enables Next.js draft mode for previewing unpublished content
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const token = searchParams.get('token');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'post';

    // Validate secret
    if (secret !== siteConfig.wordpress.secret) {
        return NextResponse.json(
            { message: 'Invalid secret' },
            { status: 401 }
        );
    }

    // Validate token with WordPress
    if (token) {
        try {
            const response = await fetch(
                `${siteConfig.wordpress.graphqlEndpoint.replace('/graphql', '')}/wp-json/flatwp/v1/preview/validate`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                }
            );

            if (!response.ok) {
                return NextResponse.json(
                    { message: 'Invalid preview token' },
                    { status: 401 }
                );
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            // Continue anyway for development
        }
    }

    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Redirect to the post/page
    if (slug) {
        if (type === 'page') {
            redirect(`/${slug}`);
        }
        redirect(`/blog/${slug}`);
    }

    // Default redirect
    redirect('/');
}
