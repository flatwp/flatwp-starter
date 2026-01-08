/**
 * Image Text Block (Server Component)
 * Side-by-side image and text content
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface ImageTextBlockProps {
    block: EditorBlock;
}

export function ImageTextBlock({ block }: ImageTextBlockProps) {
    const { attributes } = block;

    const heading = attributes?.heading as string;
    const content = attributes?.content as string;
    const imageUrl = attributes?.imageUrl as string;
    const imagePosition = (attributes?.imagePosition as string) || 'right';
    const ctaText = attributes?.ctaText as string;
    const ctaUrl = attributes?.ctaUrl as string;
    const theme = (attributes?.theme as string) || 'dark';
    const className = attributes?.className as string;

    const isImageLeft = imagePosition === 'left';

    const themeClasses = theme === 'light'
        ? 'bg-white text-gray-900'
        : 'bg-gray-900/50 text-white';

    return (
        <section className={cn('py-16 md:py-24', themeClasses, className)}>
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={isImageLeft ? 'lg:order-2' : ''}>
                    {heading && (
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
                    )}
                    {content && (
                        <div
                            className="prose prose-invert max-w-none text-gray-400 mb-8"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                    {ctaText && ctaUrl && (
                        <Link
                            href={ctaUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
                <div className={isImageLeft ? 'lg:order-1' : ''}>
                    {imageUrl && (
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={heading || ''}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
