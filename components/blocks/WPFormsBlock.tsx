/**
 * WPForms Block (Client Component)
 * Renders WPForms and handles form submission via proxy API
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
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

interface SubmitState {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
}

export function WPFormsBlock({ block }: WPFormsBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { renderedHtml } = block;
    const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

    // Handle form submission
    const handleSubmit = useCallback(async (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.target as HTMLFormElement;
        if (!form) return;

        setSubmitState({ status: 'submitting' });

        try {
            // Collect form data
            const formData = new FormData(form);

            // Add WPForms action if not present
            if (!formData.has('action')) {
                formData.append('action', 'wpforms_submit');
            }

            // Submit to our proxy API
            const response = await fetch('/api/forms/wpforms', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && (data.success !== false)) {
                setSubmitState({
                    status: 'success',
                    message: data.data?.confirmation || 'Thank you! Your form has been submitted successfully.',
                });

                // Reset form
                form.reset();

                // Scroll to success message
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Handle WPForms validation errors
                const errorMessage = data.data?.errors
                    ? Object.values(data.data.errors).flat().join(', ')
                    : data.message || 'There was an error submitting the form. Please try again.';

                setSubmitState({
                    status: 'error',
                    message: errorMessage,
                });
            }
        } catch (error) {
            console.error('[WPFormsBlock] Submission error:', error);
            setSubmitState({
                status: 'error',
                message: 'Unable to submit form. Please check your connection and try again.',
            });
        }
    }, []);

    // Setup form interception
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Find all forms in the container
        const forms = container.querySelectorAll('form');

        // Attach submit handler to each form
        forms.forEach((form) => {
            // Override the form action to prevent direct submission to WordPress
            form.setAttribute('data-original-action', form.action || '');
            form.action = 'javascript:void(0)';
            form.method = 'POST';

            // Remove any existing onsubmit handlers
            form.onsubmit = null;

            // Add our handler with capture to intercept before other handlers
            form.addEventListener('submit', handleSubmit, { capture: true });
        });

        // DO NOT initialize WPForms scripts - they interfere with our submission handling
        // The form display works without them, and we handle submission ourselves

        console.log('[WPFormsBlock] Intercepted', forms.length, 'form(s)');

        // Cleanup
        return () => {
            forms.forEach((form) => {
                form.removeEventListener('submit', handleSubmit, { capture: true });
                // Restore original action
                const originalAction = form.getAttribute('data-original-action');
                if (originalAction) {
                    form.action = originalAction;
                }
            });
        };
    }, [renderedHtml, handleSubmit]);

    // Reset state after showing success/error
    useEffect(() => {
        if (submitState.status === 'success') {
            // Auto-hide success message after 10 seconds
            const timeout = setTimeout(() => {
                setSubmitState({ status: 'idle' });
            }, 10000);
            return () => clearTimeout(timeout);
        }
    }, [submitState.status]);

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
        <div ref={containerRef} className={className}>
            {/* Success Message */}
            {submitState.status === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <p className="font-medium">Success!</p>
                            <p className="text-sm opacity-90">{submitState.message}</p>
                        </div>
                        <button
                            onClick={() => setSubmitState({ status: 'idle' })}
                            className="ml-auto p-1 hover:bg-green-500/20 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitState.status === 'error' && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-medium">Error</p>
                            <p className="text-sm opacity-90">{submitState.message}</p>
                        </div>
                        <button
                            onClick={() => setSubmitState({ status: 'idle' })}
                            className="ml-auto p-1 hover:bg-red-500/20 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Form Container */}
            <div
                className={cn(
                    'transition-opacity duration-200',
                    submitState.status === 'submitting' && 'opacity-50 pointer-events-none'
                )}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            {/* Loading Overlay */}
            {submitState.status === 'submitting' && (
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
