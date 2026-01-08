/**
 * Features Block (Server Component)
 * Displays a grid of feature items with icons
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';
import { getIcon } from './icons';

interface FeaturesBlockProps {
    block: EditorBlock;
}

export function FeaturesBlock({ block }: FeaturesBlockProps) {
    const { attributes, innerBlocks = [] } = block;

    const heading = attributes?.heading as string;
    const description = (attributes?.description || attributes?.subheading) as string;
    const columns = parseInt(attributes?.columns as string, 10) || 3;
    const iconStyle = (attributes?.iconStyle as string) || 'circle';
    const theme = ((attributes?.theme || attributes?.colorScheme) as string) || 'dark';
    const className = attributes?.className as string;

    // Support both WordPress and legacy block names
    const featureItems = innerBlocks.filter(
        (b) => b.name === 'flatwp/feature-item' || b.name === 'flatwp/features-item'
    );

    const themeClasses = theme === 'light'
        ? 'bg-white text-gray-900'
        : 'bg-gray-900/50 text-white';

    const iconStyleClasses: Record<string, string> = {
        circle: 'rounded-full',
        square: 'rounded-xl',
        none: '',
    };

    return (
        <section className={cn('py-16 md:py-24', themeClasses, className)}>
            <div className="max-w-6xl mx-auto px-6">
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        {heading}
                    </h2>
                )}
                {description && (
                    <p className="text-lg text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
                <div className={cn(
                    'grid grid-cols-1 md:grid-cols-2 gap-8',
                    columns === 3 && 'lg:grid-cols-3',
                    columns === 4 && 'lg:grid-cols-4'
                )}>
                    {featureItems.map((item, index) => {
                        const title = item.attributes?.title as string;
                        const featureDescription = item.attributes?.description as string;
                        const icon = item.attributes?.icon as string;
                        const link = item.attributes?.link as string;
                        const IconComponent = getIcon(icon || 'zap');

                        const content = (
                            <div className="group p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                                {iconStyle !== 'none' && (
                                    <div className={cn(
                                        'inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 text-blue-500 mb-4 group-hover:bg-blue-500/20 transition-colors',
                                        iconStyleClasses[iconStyle]
                                    )}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                )}
                                {title && (
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                        {title}
                                    </h3>
                                )}
                                {featureDescription && (
                                    <p className="text-gray-400 leading-relaxed">
                                        {featureDescription}
                                    </p>
                                )}
                                {link && (
                                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
                                        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </div>
                        );

                        if (link) {
                            return (
                                <Link key={item.clientId || index} href={link} className="block">
                                    {content}
                                </Link>
                            );
                        }

                        return <div key={item.clientId || index}>{content}</div>;
                    })}
                </div>
            </div>
        </section>
    );
}
