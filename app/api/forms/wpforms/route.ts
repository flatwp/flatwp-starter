/**
 * WPForms Submission Proxy
 * Forwards form submissions to WordPress and returns the response
 * This handles CORS issues in headless WordPress setups
 */

import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

// Extract WordPress base URL from GraphQL endpoint
function getWordPressUrl(): string {
  const graphqlUrl = siteConfig.wordpress.graphqlEndpoint;
  // Remove /graphql from the end to get base URL
  return graphqlUrl.replace(/\/graphql\/?$/, '');
}

export async function POST(request: NextRequest) {
  try {
    // Get form data from the request
    const formData = await request.formData();

    // WPForms sends data to admin-ajax.php with action=wpforms_submit
    const wordpressUrl = getWordPressUrl();
    const ajaxUrl = `${wordpressUrl}/wp-admin/admin-ajax.php`;

    // Ensure the wpforms action is set
    if (!formData.has('action')) {
      formData.append('action', 'wpforms_submit');
    }

    // Forward the request to WordPress
    const response = await fetch(ajaxUrl, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - fetch will set it with boundary for FormData
        'Accept': 'application/json',
      },
    });

    // Get the response
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      // WPForms sometimes returns HTML for confirmations
      const text = await response.text();
      data = { success: response.ok, html: text };
    }

    // Return the WordPress response
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('[WPForms Proxy] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Form submission failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
