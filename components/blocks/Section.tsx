/**
 * Section Block (Server Component)
 * Flexible section wrapper with background options, spacing, and container width controls
 *
 * Uses WordPress renderedHtml when available (includes inline styles)
 * Falls back to React rendering for preview/API modes
 */

import Image from 'next/image';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';
import { EditorBlockRenderer } from './EditorBlockRenderer';

interface SectionBlockProps {
    block: EditorBlock;
    allBlocks?: EditorBlock[];
}

export function SectionBlock({ block }: SectionBlockProps) {
    const { attributes, innerBlocks = [], renderedHtml } = block;

    // If we have renderedHtml and no innerBlocks to render, use WordPress HTML
    if (renderedHtml && innerBlocks.length === 0) {
        return (
            <div
                className="flatwp-section-wrapper"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Background attributes
    const colorScheme = (attributes?.colorScheme as string) || 'transparent';
    const backgroundType = (attributes?.backgroundType as string) || 'color';
    const backgroundImageUrl = attributes?.backgroundImageUrl as string;
    const overlayOpacity = (attributes?.overlayOpacity as number) ?? 50;

    // Gradient attributes
    const gradientFrom = (attributes?.gradientFrom as string) || '#2563eb';
    const gradientTo = (attributes?.gradientTo as string) || '#7c3aed';
    const gradientDirection = (attributes?.gradientDirection as string) || 'to-br';

    // Spacing attributes
    const paddingTop = (attributes?.paddingTop as string) || 'large';
    const paddingBottom = (attributes?.paddingBottom as string) || 'large';
    const containerWidth = (attributes?.containerWidth as string) || 'default';

    // Divider attributes
    const dividerTop = (attributes?.dividerTop as string) || 'none';
    const dividerBottom = (attributes?.dividerBottom as string) || 'none';

    const className = attributes?.className as string;

    // Color scheme classes
    const colorSchemeClasses: Record<string, string> = {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-900 text-white',
        primary: 'bg-blue-600 text-white',
        gradient: '', // Handled by inline style
        transparent: 'bg-transparent',
    };

    // Padding classes
    const paddingTopClasses: Record<string, string> = {
        none: 'pt-0',
        small: 'pt-8 md:pt-12',
        medium: 'pt-12 md:pt-16',
        large: 'pt-16 md:pt-24',
        xlarge: 'pt-24 md:pt-32',
    };

    const paddingBottomClasses: Record<string, string> = {
        none: 'pb-0',
        small: 'pb-8 md:pb-12',
        medium: 'pb-12 md:pb-16',
        large: 'pb-16 md:pb-24',
        xlarge: 'pb-24 md:pb-32',
    };

    // Container width classes
    const containerWidthClasses: Record<string, string> = {
        narrow: 'max-w-3xl',
        default: 'max-w-6xl',
        wide: 'max-w-7xl',
        full: 'max-w-none px-0',
    };

    // Build inline styles
    const buildBackgroundStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {};

        if (backgroundType === 'gradient' || colorScheme === 'gradient') {
            const directionMap: Record<string, string> = {
                'to-r': 'to right',
                'to-l': 'to left',
                'to-b': 'to bottom',
                'to-t': 'to top',
                'to-br': 'to bottom right',
                'to-bl': 'to bottom left',
                'to-tr': 'to top right',
                'to-tl': 'to top left',
            };
            const direction = directionMap[gradientDirection] || 'to bottom right';
            style.background = `linear-gradient(${direction}, ${gradientFrom}, ${gradientTo})`;
        }

        return style;
    };

    // SVG divider paths
    const dividerSvgs: Record<string, { path: string; viewBox: string }> = {
        wave: {
            viewBox: '0 0 1200 120',
            path: 'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z',
        },
        curve: {
            viewBox: '0 0 1200 120',
            path: 'M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z',
        },
        triangle: {
            viewBox: '0 0 1200 120',
            path: 'M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z',
        },
        slant: {
            viewBox: '0 0 1200 120',
            path: 'M1200 120L0 16.48 0 0 1200 0 1200 120z',
        },
    };

    const renderDivider = (type: string, position: 'top' | 'bottom') => {
        if (type === 'none' || !dividerSvgs[type]) return null;

        const { viewBox, path } = dividerSvgs[type];
        const isTop = position === 'top';

        return (
            <div
                className={cn(
                    'absolute left-0 w-full overflow-hidden',
                    isTop ? 'top-0' : 'bottom-0',
                    isTop && 'transform rotate-180'
                )}
                style={{ height: '60px' }}
            >
                <svg
                    viewBox={viewBox}
                    className={cn(
                        'absolute w-full h-full',
                        colorScheme === 'dark' || colorScheme === 'primary'
                            ? 'fill-gray-950'
                            : 'fill-white'
                    )}
                    preserveAspectRatio="none"
                >
                    <path d={path} />
                </svg>
            </div>
        );
    };

    return (
        <section
            className={cn(
                'relative',
                colorSchemeClasses[colorScheme],
                paddingTopClasses[paddingTop],
                paddingBottomClasses[paddingBottom],
                className
            )}
            style={buildBackgroundStyle()}
        >
            {/* Background image with overlay */}
            {backgroundType === 'image' && backgroundImageUrl && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: overlayOpacity / 100 }}
                    />
                </div>
            )}

            {/* Top divider */}
            {renderDivider(dividerTop, 'top')}

            {/* Content container */}
            <div
                className={cn(
                    'relative z-10 mx-auto',
                    containerWidth !== 'full' && 'px-6',
                    containerWidthClasses[containerWidth]
                )}
            >
                {innerBlocks.length > 0 && (
                    <EditorBlockRenderer blocks={innerBlocks} />
                )}
            </div>

            {/* Bottom divider */}
            {renderDivider(dividerBottom, 'bottom')}
        </section>
    );
}
