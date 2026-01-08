/**
 * Card Block (Server Component)
 * Container block that wraps inner blocks with full styling support
 */

import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';
import { EditorBlockRenderer } from './EditorBlockRenderer';

interface CardBlockProps {
    block: EditorBlock;
    allBlocks?: EditorBlock[];
}

export function CardBlock({ block }: CardBlockProps) {
    const { attributes, innerBlocks = [], renderedHtml } = block;

    // Get all styling attributes from WordPress block
    const colorScheme = (attributes?.colorScheme as string) || 'light';
    const borderRadius = (attributes?.borderRadius as string) || 'lg';
    const borderStyle = (attributes?.borderStyle as string) || 'subtle';
    const shadow = (attributes?.shadow as string) || 'md';
    const padding = (attributes?.padding as string) || 'default';
    const hoverEffect = (attributes?.hoverEffect as string) || 'none';

    // Custom color overrides
    const customBackground = attributes?.customBackground as string;
    const customTextColor = attributes?.customTextColor as string;
    const customBorderColor = attributes?.customBorderColor as string;
    const gradientFrom = attributes?.gradientFrom as string;
    const gradientTo = attributes?.gradientTo as string;

    const className = attributes?.className as string;

    // Color scheme classes (used when no custom colors)
    const colorSchemeClasses: Record<string, string> = {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-800 text-white',
        primary: 'bg-blue-600 text-white',
        gradient: '', // Handled by inline style
        transparent: 'bg-transparent',
    };

    // Border radius classes
    const borderRadiusClasses: Record<string, string> = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
    };

    // Border style classes
    const borderStyleClasses: Record<string, string> = {
        none: 'border-0',
        subtle: 'border border-gray-200 dark:border-gray-700',
        prominent: 'border-2 border-gray-300 dark:border-gray-600',
    };

    // Shadow classes
    const shadowClasses: Record<string, string> = {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
    };

    // Padding classes
    const paddingClasses: Record<string, string> = {
        none: 'p-0',
        compact: 'p-3 md:p-4',
        default: 'p-4 md:p-6',
        relaxed: 'p-6 md:p-8',
    };

    // Hover effect classes
    const hoverEffectClasses: Record<string, string> = {
        none: '',
        lift: 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg',
        glow: 'transition-shadow duration-300 hover:shadow-blue-500/25 hover:shadow-xl',
        border: 'transition-colors duration-300 hover:border-blue-500',
    };

    // Build inline styles for custom colors
    const inlineStyles: React.CSSProperties = {};

    if (customBackground) {
        inlineStyles.backgroundColor = customBackground;
    } else if (colorScheme === 'gradient' && gradientFrom && gradientTo) {
        inlineStyles.background = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
    }

    if (customTextColor) {
        inlineStyles.color = customTextColor;
    }

    if (customBorderColor) {
        inlineStyles.borderColor = customBorderColor;
    }

    // If we have renderedHtml and no innerBlocks, use rendered HTML
    if (renderedHtml && innerBlocks.length === 0) {
        return (
            <div
                className={cn(
                    'transition-all',
                    !customBackground && colorSchemeClasses[colorScheme],
                    borderRadiusClasses[borderRadius],
                    borderStyleClasses[borderStyle],
                    shadowClasses[shadow],
                    paddingClasses[padding],
                    hoverEffectClasses[hoverEffect],
                    className
                )}
                style={inlineStyles}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    return (
        <div
            className={cn(
                'transition-all',
                !customBackground && colorSchemeClasses[colorScheme],
                borderRadiusClasses[borderRadius],
                borderStyleClasses[borderStyle],
                shadowClasses[shadow],
                paddingClasses[padding],
                hoverEffectClasses[hoverEffect],
                className
            )}
            style={inlineStyles}
        >
            {innerBlocks.length > 0 && (
                <EditorBlockRenderer blocks={innerBlocks} />
            )}
        </div>
    );
}
