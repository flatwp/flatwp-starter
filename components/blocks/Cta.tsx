/**
 * CTA Block (Server Component)
 * Supports boxed, inline, banner, and split variants with full styling control
 *
 * Uses WordPress renderedHtml when available (includes inline styles)
 * Falls back to React rendering for preview/API modes
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface CtaBlockProps {
    block: EditorBlock;
}

export function CtaBlock({ block }: CtaBlockProps) {
    const { attributes, renderedHtml } = block;

    // If we have renderedHtml and it contains styles, use it
    if (renderedHtml && renderedHtml.includes('style=')) {
        return (
            <div
                className="flatwp-cta-wrapper"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Content attributes
    const variant = (attributes?.variant as string) || 'boxed';
    const heading = attributes?.heading as string;
    const description = (attributes?.ctaDescription || attributes?.description || attributes?.text) as string;
    const alignment = (attributes?.alignment as string) || 'center';
    const className = attributes?.className as string;

    // Button attributes
    const ctaText = (attributes?.ctaText || attributes?.buttonText) as string;
    const ctaUrl = (attributes?.ctaUrl || attributes?.buttonUrl) as string;
    const buttonStyle = (attributes?.buttonStyle as string) || 'solid';
    const secondaryCtaText = (attributes?.secondaryCtaText || attributes?.secondaryButtonText) as string;
    const secondaryCtaUrl = (attributes?.secondaryCtaUrl || attributes?.secondaryButtonUrl) as string;

    // Styling attributes
    const colorScheme = ((attributes?.colorScheme || attributes?.theme) as string) || 'primary';
    const gradientFrom = (attributes?.gradientFrom as string) || '#2563eb';
    const gradientTo = (attributes?.gradientTo as string) || '#7c3aed';
    const imageUrl = attributes?.imageUrl as string;

    const alignClasses: Record<string, string> = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
    };

    // Color scheme classes
    const colorSchemeClasses: Record<string, string> = {
        light: 'bg-gray-100 text-gray-900',
        dark: 'bg-gray-900 text-white',
        primary: 'bg-blue-600 text-white',
        gradient: 'text-white', // Gradient applied via inline style
    };

    // Build inline styles for gradient
    const buildBackgroundStyle = (): React.CSSProperties => {
        if (colorScheme === 'gradient') {
            return {
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            };
        }
        return {};
    };

    // Button style classes
    const primaryButtonClasses: Record<string, Record<string, string>> = {
        light: {
            solid: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
            ghost: 'text-blue-600 hover:bg-blue-50',
        },
        dark: {
            solid: 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg',
            outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-900',
            ghost: 'text-white hover:bg-white/10',
        },
        primary: {
            solid: 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg',
            outline: 'border-2 border-white text-white hover:bg-white hover:text-blue-600',
            ghost: 'text-white hover:bg-white/10',
        },
        gradient: {
            solid: 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg',
            outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-900',
            ghost: 'text-white hover:bg-white/10',
        },
    };

    const secondaryButtonClasses: Record<string, string> = {
        light: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        dark: 'bg-white/10 text-white hover:bg-white/20',
        primary: 'bg-white/20 text-white hover:bg-white/30',
        gradient: 'bg-white/20 text-white hover:bg-white/30',
    };

    // Inline variant - simple inline CTA
    if (variant === 'inline') {
        return (
            <section className={cn('py-8', className)}>
                <div className={cn('max-w-4xl mx-auto px-6 flex flex-col sm:flex-row gap-4', alignClasses[alignment])}>
                    {description && (
                        <p className="text-gray-400 flex-1">{description}</p>
                    )}
                    {ctaText && ctaUrl && (
                        <Link
                            href={ctaUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </section>
        );
    }

    // Split variant - image on one side
    if (variant === 'split' && imageUrl) {
        return (
            <section className={cn('py-16', className)}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className={cn('flex flex-col', alignClasses[alignment === 'center' ? 'left' : alignment])}>
                            {heading && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                    {heading}
                                </h2>
                            )}
                            {description && (
                                <p className="text-lg text-gray-400 mb-8 max-w-xl">
                                    {description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-4">
                                {ctaText && ctaUrl && (
                                    <Link
                                        href={ctaUrl}
                                        className={cn(
                                            'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all',
                                            'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25'
                                        )}
                                    >
                                        {ctaText}
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                                {secondaryCtaText && secondaryCtaUrl && (
                                    <Link
                                        href={secondaryCtaUrl}
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        {secondaryCtaText}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={heading || ''}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Banner variant - full-width strip
    if (variant === 'banner') {
        return (
            <section
                className={cn(
                    'py-12 border-y',
                    colorScheme === 'light' ? 'border-gray-200' : 'border-gray-700/50',
                    colorSchemeClasses[colorScheme],
                    className
                )}
                style={buildBackgroundStyle()}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            {heading && (
                                <h3 className="text-xl md:text-2xl font-bold mb-2">
                                    {heading}
                                </h3>
                            )}
                            {description && (
                                <p className={colorScheme === 'light' ? 'text-gray-600' : 'text-white/80'}>
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 shrink-0">
                            {ctaText && ctaUrl && (
                                <Link
                                    href={ctaUrl}
                                    className={cn(
                                        'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                                        primaryButtonClasses[colorScheme]?.[buttonStyle] || primaryButtonClasses.dark.solid
                                    )}
                                >
                                    {ctaText}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                            {secondaryCtaText && secondaryCtaUrl && (
                                <Link
                                    href={secondaryCtaUrl}
                                    className={cn(
                                        'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                                        secondaryButtonClasses[colorScheme]
                                    )}
                                >
                                    {secondaryCtaText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Default: Boxed variant
    return (
        <section className={cn('py-16', className)}>
            <div className="max-w-4xl mx-auto px-6">
                <div
                    className={cn(
                        'rounded-2xl p-8 md:p-12',
                        colorSchemeClasses[colorScheme]
                    )}
                    style={buildBackgroundStyle()}
                >
                    <div className={cn('flex flex-col', alignClasses[alignment])}>
                        {heading && (
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                {heading}
                            </h2>
                        )}
                        {description && (
                            <p className={cn(
                                'text-lg mb-8 max-w-xl',
                                colorScheme === 'light' ? 'text-gray-600' : 'text-white/80'
                            )}>
                                {description}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4">
                            {ctaText && ctaUrl && (
                                <Link
                                    href={ctaUrl}
                                    className={cn(
                                        'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all',
                                        primaryButtonClasses[colorScheme]?.[buttonStyle] || primaryButtonClasses.primary.solid
                                    )}
                                >
                                    {ctaText}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                            {secondaryCtaText && secondaryCtaUrl && (
                                <Link
                                    href={secondaryCtaUrl}
                                    className={cn(
                                        'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all',
                                        secondaryButtonClasses[colorScheme]
                                    )}
                                >
                                    {secondaryCtaText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
