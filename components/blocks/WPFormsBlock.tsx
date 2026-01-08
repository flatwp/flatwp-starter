/**
 * WPForms Block (Client Component)
 * Renders WPForms shortcode content and initializes form scripts after hydration
 */

'use client';

import { useRef, useEffect } from 'react';
import type { EditorBlock } from '@/lib/wordpress';
import { formsConfig } from '@/lib/config/forms.config';
import { cn } from '@/lib/utils';

// Extend Window interface for WPForms global
declare global {
    interface Window {
        wpforms?: {
            init?: () => void;
            [key: string]: unknown;
        };
    }
}

interface WPFormsBlockProps {
    block: EditorBlock;
    allBlocks?: EditorBlock[];
}

export function WPFormsBlock({ block }: WPFormsBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { renderedHtml } = block;

    useEffect(() => {
        // Skip if scripts are disabled in config
        if (!formsConfig.wpforms.loadScripts) {
            return;
        }

        // Initialize WPForms after hydration
        // WPForms scripts may be loaded via WordPress head/footer injection
        const initWPForms = () => {
            if (typeof window !== 'undefined' && window.wpforms?.init) {
                try {
                    window.wpforms.init();
                } catch (error) {
                    // Silently handle initialization errors in production
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('[WPFormsBlock] Failed to initialize WPForms:', error);
                    }
                }
            }
        };

        // Delay initialization slightly to ensure DOM is ready
        const timeoutId = setTimeout(initWPForms, 100);

        // Cleanup on unmount
        return () => {
            clearTimeout(timeoutId);
        };
    }, [renderedHtml]);

    // Show debug message in development if no rendered HTML
    if (!renderedHtml) {
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="p-4 border border-dashed border-yellow-500 bg-yellow-50 text-yellow-800 rounded-md">
                    <p className="font-medium">WPForms Block</p>
                    <p className="text-sm">
                        No rendered HTML available. Ensure the form shortcode is being processed by WordPress.
                    </p>
                </div>
            );
        }
        return null;
    }

    const className = cn(
        'wpforms-block',
        !formsConfig.wpforms.useDefaultStyles && 'flatwp-form-tailwind'
    );

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
    );
}
