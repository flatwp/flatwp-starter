/**
 * Core Block Renderer
 * Handles WordPress core blocks (paragraphs, headings, images, etc.)
 */

import Image from 'next/image';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface CoreBlockRendererProps {
    block: EditorBlock;
}

export function CoreBlockRenderer({ block }: CoreBlockRendererProps) {
    const { name, attributes } = block;

    switch (name) {
        case 'core/paragraph':
            const content = attributes?.content as string;
            if (!content) return null;
            return (
                <p
                    className="text-lg text-gray-300 leading-relaxed my-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            );

        case 'core/heading':
            const headingContent = attributes?.content as string;
            const level = (attributes?.level as number) || 2;
            if (!headingContent) return null;

            const headingClasses: Record<number, string> = {
                1: 'text-4xl md:text-5xl font-bold mb-6',
                2: 'text-3xl md:text-4xl font-bold mb-4 mt-8',
                3: 'text-2xl md:text-3xl font-semibold mb-3 mt-6',
                4: 'text-xl md:text-2xl font-semibold mb-2 mt-4',
                5: 'text-lg font-semibold mb-2 mt-4',
                6: 'text-base font-semibold mb-2 mt-4',
            };

            const className = headingClasses[level];

            switch (level) {
                case 1:
                    return <h1 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                case 2:
                    return <h2 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                case 3:
                    return <h3 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                case 4:
                    return <h4 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                case 5:
                    return <h5 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                case 6:
                    return <h6 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
                default:
                    return <h2 className={className} dangerouslySetInnerHTML={{ __html: headingContent }} />;
            }

        case 'core/image':
            const src = attributes?.url as string;
            const alt = attributes?.alt as string;
            const width = attributes?.width as number;
            const height = attributes?.height as number;
            const caption = attributes?.caption as string;

            if (!src) return null;

            return (
                <figure className="my-8">
                    <div className="relative overflow-hidden rounded-xl">
                        <Image
                            src={src}
                            alt={alt || ''}
                            width={width || 800}
                            height={height || 600}
                            className="w-full h-auto"
                        />
                    </div>
                    {caption && (
                        <figcaption
                            className="mt-2 text-sm text-gray-500 text-center"
                            dangerouslySetInnerHTML={{ __html: caption }}
                        />
                    )}
                </figure>
            );

        case 'core/list':
            const listContent = attributes?.values as string;
            const ordered = attributes?.ordered as boolean;
            const ListTag = ordered ? 'ol' : 'ul';

            if (!listContent) return null;

            return (
                <ListTag
                    className={cn(
                        'my-4 ml-6 text-gray-300',
                        ordered ? 'list-decimal' : 'list-disc'
                    )}
                    dangerouslySetInnerHTML={{ __html: listContent }}
                />
            );

        case 'core/quote':
            const quoteContent = attributes?.value as string;
            const citation = attributes?.citation as string;

            if (!quoteContent) return null;

            return (
                <blockquote className="my-8 pl-6 border-l-4 border-blue-500">
                    <div
                        className="text-xl italic text-gray-300"
                        dangerouslySetInnerHTML={{ __html: quoteContent }}
                    />
                    {citation && (
                        <cite
                            className="block mt-2 text-sm text-gray-500 not-italic"
                            dangerouslySetInnerHTML={{ __html: citation }}
                        />
                    )}
                </blockquote>
            );

        case 'core/separator':
            return <hr className="my-12 border-gray-700" />;

        case 'core/spacer':
            const spacerHeight = (attributes?.height as string) || '24px';
            return <div style={{ height: spacerHeight }} />;

        case 'core/group':
        case 'core/columns':
        case 'core/column':
            // Container blocks - render inner blocks
            // Note: This would need inner block handling
            return null;

        default:
            // Unknown core block - log in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`Unhandled core block: ${name}`, attributes);
            }
            return null;
    }
}
