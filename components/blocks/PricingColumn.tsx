/**
 * Pricing Column Block (Server Component)
 * Displays a pricing plan with features
 *
 * Uses WordPress renderedHtml when available (includes inline styles from supports.color)
 * Falls back to React rendering for preview/API modes
 */

import Link from 'next/link';
import { Check, X } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface Feature {
    text: string;
    included: boolean;
}

interface PricingColumnBlockProps {
    block: EditorBlock;
}

export function PricingColumnBlock({ block }: PricingColumnBlockProps) {
    const { attributes, innerBlocks = [], renderedHtml } = block;

    // If we have rendered HTML from WordPress (includes all inline styles), use it
    if (renderedHtml) {
        return (
            <div
                className="flatwp-pricing-wrapper"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Fallback: React rendering for preview mode or when renderedHtml is unavailable
    const title = (attributes?.title as string) || 'Basic';
    const price = (attributes?.price as string) || '$29';
    const period = (attributes?.period as string) || '/month';
    const description = (attributes?.pricingDescription || attributes?.description) as string;
    const ctaText = (attributes?.ctaText as string) || 'Get Started';
    const ctaUrl = (attributes?.ctaUrl as string) || '#';
    const highlighted = attributes?.highlighted as boolean;
    const highlightLabel = (attributes?.highlightLabel as string) || 'Most Popular';
    const className = attributes?.className as string;

    // Parse features from attributes
    const featuresRaw = attributes?.features as (string | Feature)[] || [];
    const features: Feature[] = featuresRaw.map((f) => {
        if (typeof f === 'string') {
            try {
                return JSON.parse(f) as Feature;
            } catch {
                return { text: f, included: true };
            }
        }
        return f;
    });

    // Also check for feature inner blocks
    const featureBlocks = innerBlocks.filter(b => b.name === 'flatwp/pricing-feature');

    const baseClasses = 'bg-gray-800/50 text-white border-gray-700/50';

    const highlightClasses = highlighted
        ? 'ring-2 ring-blue-500 scale-105 shadow-xl shadow-blue-500/10'
        : '';

    return (
        <div className={cn('relative rounded-2xl p-8 border transition-all duration-300', baseClasses, highlightClasses, className)}>
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium whitespace-nowrap">
                    {highlightLabel}
                </div>
            )}
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-gray-400 ml-1">{period}</span>
                </div>
                {description && (
                    <p className="text-gray-400 mt-3 text-sm">{description}</p>
                )}
            </div>
            <ul className="space-y-4 mb-8">
                {features.length > 0 ? (
                    features.map((feature, index) => (
                        <li
                            key={index}
                            className={cn('flex items-center', !feature.included && 'text-gray-500')}
                        >
                            {feature.included ? (
                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            ) : (
                                <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                            )}
                            <span className={cn(!feature.included && 'line-through')}>{feature.text}</span>
                        </li>
                    ))
                ) : (
                    featureBlocks.map((feature, index) => {
                        const text = feature.attributes?.text as string;
                        const included = feature.attributes?.included !== false;

                        return (
                            <li
                                key={feature.clientId || index}
                                className={cn('flex items-center', !included && 'text-gray-500')}
                            >
                                {included ? (
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                ) : (
                                    <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                                )}
                                <span className={cn(!included && 'line-through')}>{text}</span>
                            </li>
                        );
                    })
                )}
            </ul>
            <Link
                href={ctaUrl}
                className={cn(
                    'block w-full text-center py-3 rounded-xl font-semibold transition-all',
                    highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                )}
            >
                {ctaText}
            </Link>
        </div>
    );
}
