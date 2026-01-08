/**
 * Logo Row Block (Server Component)
 * Displays a row of logos with optional grayscale effects
 */

import Image from 'next/image';
import Link from 'next/link';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface Logo {
    url: string;
    alt?: string;
    link?: string;
}

interface LogoRowBlockProps {
    block: EditorBlock;
}

export function LogoRowBlock({ block }: LogoRowBlockProps) {
    const { attributes } = block;

    const heading = attributes?.heading as string;
    const description = attributes?.description as string;
    const displayMode = (attributes?.displayMode as string) || 'bw';
    const columns = parseInt(attributes?.columns as string, 10) || 6;
    const theme = (attributes?.theme as string) || 'dark';
    const className = attributes?.className as string;

    // Parse logos - handle JSON string from WPGraphQL or array
    const rawLogos = attributes?.logos;
    const logos: Logo[] = (() => {
        if (!rawLogos) return [];
        if (Array.isArray(rawLogos)) return rawLogos;
        if (typeof rawLogos === 'string') {
            try {
                const parsed = JSON.parse(rawLogos);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    })();

    const filterClasses: Record<string, string> = {
        bw: 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100',
        color: '',
        'hover-color': 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100',
    };

    const themeClasses = theme === 'light' ? 'bg-white' : 'bg-gray-900/30';

    return (
        <section className={cn('py-12 md:py-16', themeClasses, className)}>
            <div className="max-w-6xl mx-auto px-6">
                {heading && (
                    <h3 className="text-lg font-medium text-center text-gray-400 mb-8">
                        {heading}
                    </h3>
                )}
                {description && (
                    <p className="text-sm text-gray-500 text-center mb-8 max-w-xl mx-auto">
                        {description}
                    </p>
                )}
                <div className={cn(
                    'grid gap-8 md:gap-12 items-center justify-items-center',
                    'grid-cols-3',
                    columns === 4 && 'md:grid-cols-4',
                    columns === 5 && 'md:grid-cols-5',
                    columns === 6 && 'md:grid-cols-6'
                )}>
                    {logos
                        .filter((logo) => logo.url && typeof logo.url === 'string')
                        .map((logo, index) => {
                            const logoElement = (
                                <div
                                    key={index}
                                    className={cn('transition-all duration-300', filterClasses[displayMode])}
                                >
                                    <Image
                                        src={logo.url}
                                        alt={logo.alt || `Logo ${index + 1}`}
                                        width={120}
                                        height={40}
                                        className="h-8 md:h-10 w-auto object-contain"
                                    />
                                </div>
                            );

                            if (logo.link && typeof logo.link === 'string') {
                                return (
                                    <Link
                                        key={index}
                                        href={logo.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {logoElement}
                                    </Link>
                                );
                            }

                            return logoElement;
                        })}
                </div>
            </div>
        </section>
    );
}
