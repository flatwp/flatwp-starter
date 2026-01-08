/**
 * Revalidate API Route
 * Handles on-demand ISR revalidation requests from WordPress
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const secret = process.env.FLATWP_SECRET || '';

/**
 * Verify HMAC signature from WordPress
 */
function verifySignature(payload: string, signature: string, timestamp: string): boolean {
    if (!secret) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp, 10);
    if (Math.abs(now - requestTime) > 300) {
        console.warn('Revalidation request timestamp too old');
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-flatwp-signature') || '';
        const timestamp = request.headers.get('x-flatwp-timestamp') || '';

        // Parse body
        let data: { secret?: string; paths?: string[]; tags?: string[] };
        try {
            data = JSON.parse(body);
        } catch {
            return NextResponse.json(
                { message: 'Invalid JSON body' },
                { status: 400 }
            );
        }

        // Verify authentication (either HMAC signature or secret in body)
        const isValidSignature = signature && timestamp && verifySignature(body, signature, timestamp);
        const isValidSecret = data.secret === secret;

        if (!isValidSignature && !isValidSecret) {
            console.warn('Revalidation request failed authentication');
            return NextResponse.json(
                { message: 'Invalid authentication' },
                { status: 401 }
            );
        }

        const { paths = [], tags = [] } = data;
        const revalidated: string[] = [];
        const errors: string[] = [];

        // Revalidate paths
        for (const path of paths) {
            try {
                revalidatePath(path);
                revalidated.push(`path:${path}`);
                console.log(`Revalidated path: ${path}`);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                errors.push(`path:${path} - ${message}`);
                console.error(`Failed to revalidate path ${path}:`, error);
            }
        }

        // Revalidate tags
        for (const tag of tags) {
            try {
                revalidateTag(tag);
                revalidated.push(`tag:${tag}`);
                console.log(`Revalidated tag: ${tag}`);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                errors.push(`tag:${tag} - ${message}`);
                console.error(`Failed to revalidate tag ${tag}:`, error);
            }
        }

        return NextResponse.json({
            revalidated: true,
            paths: revalidated,
            errors: errors.length > 0 ? errors : undefined,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Health check for GET requests
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: 'revalidate',
        timestamp: new Date().toISOString(),
    });
}
