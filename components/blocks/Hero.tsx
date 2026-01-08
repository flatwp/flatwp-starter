/**
 * Hero Block (Server Component)
 * Supports multiple variants with full styling control
 *
 * Uses WordPress renderedHtml when available (includes inline styles from supports.color)
 * Falls back to React rendering for preview/API modes
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface HeroBlockProps {
    block: EditorBlock;
}

export function HeroBlock({ block }: HeroBlockProps) {
    const { attributes, name, renderedHtml } = block;

    // For hero-minimal variant with supports.color, prefer renderedHtml
    if (name === 'flatwp/hero-minimal' && renderedHtml) {
        return (
            <div
                className="flatwp-hero-wrapper"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Detect variant from block name or attributes
    let variant = (attributes?.variant as string) || 'centered';
    if (name === 'flatwp/hero-minimal') variant = 'minimal';
    if (name === 'flatwp/hero-split') variant = 'split';

    // Content attributes
    const heading = (attributes?.heading as string) || '';
    const subheading = (attributes?.subheading as string) || (attributes?.heroDescription as string);
    const description = attributes?.description as string;
    const alignment = (attributes?.alignment as string) || 'center';
    const badge = attributes?.badge as string;
    const className = attributes?.className as string;

    // Button attributes
    const primaryCtaText = (attributes?.primaryButtonText || attributes?.ctaText) as string;
    const primaryCtaUrl = (attributes?.primaryButtonUrl || attributes?.ctaUrl) as string;
    const primaryButtonStyle = (attributes?.primaryButtonStyle as string) || 'solid';
    const secondaryCtaText = attributes?.secondaryButtonText as string;
    const secondaryCtaUrl = attributes?.secondaryButtonUrl as string;

    // Background attributes
    const backgroundImage = (attributes?.backgroundImageUrl || attributes?.backgroundImage) as string;
    const sideImageUrl = attributes?.sideImageUrl as string;
    const imagePosition = (attributes?.imagePosition as string) || 'right';
    const overlayOpacity = (attributes?.overlayOpacity as number) ?? 50;
    const overlayColor = (attributes?.overlayColor as string) || '#000000';

    // Gradient attributes
    const gradientFrom = (attributes?.gradientFrom as string) || '#2563eb';
    const gradientTo = (attributes?.gradientTo as string) || '#7c3aed';
    const gradientDirection = (attributes?.gradientDirection as string) || 'to-r';

    // Layout attributes
    const minHeight = (attributes?.minHeight as string) || '80vh';
    const colorScheme = ((attributes?.colorScheme || attributes?.theme) as string) || 'dark';

    // Build inline styles based on variant and colorScheme
    const buildBackgroundStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {};

        if (variant === 'gradient' || colorScheme === 'primary') {
            const direction = gradientDirection.replace('to-', '').replace('r', 'right').replace('l', 'left')
                .replace('b', 'bottom').replace('t', 'top').replace('br', 'bottom right')
                .replace('bl', 'bottom left').replace('tr', 'top right').replace('tl', 'top left');
            style.background = `linear-gradient(to ${direction}, ${gradientFrom}, ${gradientTo})`;
        }

        if (minHeight && minHeight !== 'auto') {
            style.minHeight = minHeight;
        }

        return style;
    };

    const alignClasses: Record<string, string> = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
    };

    const colorSchemeClasses: Record<string, string> = {
        light: 'bg-white text-gray-900',
        dark: 'bg-gradient-to-b from-gray-900 to-gray-950 text-white',
        primary: 'text-white', // Background via inline style
        custom: '', // Custom colors via inline style
    };

    // Primary button styles based on primaryButtonStyle
    const primaryButtonClasses: Record<string, string> = {
        solid: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40',
        outline: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white',
        ghost: 'bg-transparent text-blue-500 hover:bg-blue-500/10',
    };

    // Split variant - two columns with image
    if (variant === 'split') {
        const imageUrl = sideImageUrl || backgroundImage;
        const isImageLeft = imagePosition === 'left';

        return (
            <section
                className={cn(
                    'relative py-16 md:py-24',
                    colorSchemeClasses[colorScheme] || colorSchemeClasses.dark,
                    className
                )}
                style={buildBackgroundStyle()}
            >
                <div className={cn(
                    'max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
                    isImageLeft && 'lg:flex-row-reverse'
                )}>
                    {isImageLeft && imageUrl && (
                        <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={heading || ''}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col items-start">
                        {badge && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                                {badge}
                            </span>
                        )}
                        {heading && (
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                {heading}
                            </h1>
                        )}
                        {(subheading || description) && (
                            <p className={cn(
                                'text-lg md:text-xl mb-8 leading-relaxed',
                                colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            )}>
                                {subheading || description}
                            </p>
                        )}
                        {(primaryCtaText || secondaryCtaText) && (
                            <div className="flex flex-wrap gap-4">
                                {primaryCtaText && primaryCtaUrl && (
                                    <Link
                                        href={primaryCtaUrl}
                                        className={cn(
                                            'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all',
                                            primaryButtonClasses[primaryButtonStyle] || primaryButtonClasses.solid
                                        )}
                                    >
                                        {primaryCtaText}
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                                {secondaryCtaText && secondaryCtaUrl && (
                                    <Link
                                        href={secondaryCtaUrl}
                                        className={cn(
                                            'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all',
                                            colorScheme === 'light'
                                                ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                                : 'text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10'
                                        )}
                                    >
                                        {secondaryCtaText}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    {!isImageLeft && imageUrl && (
                        <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={heading || ''}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Image background variant
    if (variant === 'image-bg' && backgroundImage) {
        return (
            <section
                className={cn('relative flex items-center', className)}
                style={{ minHeight }}
            >
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: overlayColor,
                            opacity: overlayOpacity / 100,
                        }}
                    />
                </div>

                <div className={cn(
                    'relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col text-white',
                    alignClasses[alignment]
                )}>
                    {badge && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
                            <Zap className="w-4 h-4" />
                            {badge}
                        </span>
                    )}
                    {heading && (
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
                            {heading}
                        </h1>
                    )}
                    {(subheading || description) && (
                        <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                            {subheading || description}
                        </p>
                    )}
                    {(primaryCtaText || secondaryCtaText) && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {primaryCtaText && primaryCtaUrl && (
                                <Link
                                    href={primaryCtaUrl}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/25"
                                >
                                    {primaryCtaText}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                            {secondaryCtaText && secondaryCtaUrl && (
                                <Link
                                    href={secondaryCtaUrl}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                                >
                                    {secondaryCtaText}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Default: Centered/Minimal/Gradient variants
    return (
        <section
            className={cn(
                'relative py-20 md:py-32',
                colorSchemeClasses[colorScheme] || colorSchemeClasses.dark,
                className
            )}
            style={buildBackgroundStyle()}
        >
            {/* Optional background image for centered variant */}
            {backgroundImage && variant !== 'gradient' && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt=""
                        fill
                        className="object-cover opacity-20"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/80"
                        style={overlayColor !== '#000000' ? { backgroundColor: overlayColor } : undefined}
                    />
                </div>
            )}

            <div className={cn(
                'relative z-10 max-w-5xl mx-auto px-6 flex flex-col',
                alignClasses[alignment]
            )}>
                {badge && (
                    <span className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border',
                        colorScheme === 'light'
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    )}>
                        <Zap className="w-4 h-4" />
                        {badge}
                    </span>
                )}
                {heading && (
                    <h1 className={cn(
                        'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6',
                        colorScheme === 'light'
                            ? 'text-gray-900'
                            : 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'
                    )}>
                        {heading}
                    </h1>
                )}
                {(subheading || description) && (
                    <p className={cn(
                        'text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl leading-relaxed',
                        colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    )}>
                        {subheading || description}
                    </p>
                )}
                {(primaryCtaText || secondaryCtaText) && (
                    <div className="flex flex-col sm:flex-row gap-4">
                        {primaryCtaText && primaryCtaUrl && (
                            <Link
                                href={primaryCtaUrl}
                                className={cn(
                                    'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5',
                                    primaryButtonClasses[primaryButtonStyle] || primaryButtonClasses.solid
                                )}
                            >
                                {primaryCtaText}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                        {secondaryCtaText && secondaryCtaUrl && (
                            <Link
                                href={secondaryCtaUrl}
                                className={cn(
                                    'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300',
                                    colorScheme === 'light'
                                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                        : 'text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                                )}
                            >
                                {secondaryCtaText}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
