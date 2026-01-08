/**
 * WPForms Connection Test
 * Tests connectivity to WordPress admin-ajax.php
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

function getWordPressUrl(): string {
    const graphqlUrl = siteConfig.wordpress.graphqlEndpoint;
    return graphqlUrl.replace(/\/graphql\/?$/, '');
}

export async function GET() {
    const wordpressUrl = getWordPressUrl();
    const ajaxUrl = `${wordpressUrl}/wp-admin/admin-ajax.php`;

    const results = {
        wordpressUrl,
        ajaxUrl,
        ajaxReachable: false,
        ajaxResponse: null as string | null,
        ajaxStatus: null as number | null,
        error: null as string | null,
    };

    try {
        // Test basic connectivity to admin-ajax.php
        const response = await fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=wpforms_test_connection',
        });

        results.ajaxReachable = true;
        results.ajaxStatus = response.status;
        results.ajaxResponse = await response.text();

        // WPForms returns "0" or "-1" for unknown actions, which means it's reachable
        if (response.ok) {
            return NextResponse.json({
                success: true,
                message: 'WordPress admin-ajax.php is reachable',
                ...results,
            });
        }
    } catch (error) {
        results.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
        success: false,
        message: 'Failed to reach WordPress admin-ajax.php',
        ...results,
    }, { status: 500 });
}
