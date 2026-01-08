/**
 * Health Check API Route
 * Simple endpoint for WordPress to verify frontend connectivity
 */

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        service: 'flatwp-starter',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
}

export async function POST() {
    return NextResponse.json({
        status: 'ok',
        service: 'flatwp-starter',
        timestamp: new Date().toISOString(),
    });
}
