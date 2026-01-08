/**
 * FAQ Block (Client Component)
 * Interactive accordion for FAQ items
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface FaqBlockProps {
    block: EditorBlock;
}

export function FaqBlock({ block }: FaqBlockProps) {
    const { attributes, innerBlocks = [] } = block;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const heading = attributes?.heading as string;
    const description = attributes?.description as string;
    const theme = (attributes?.theme as string) || 'dark';
    const className = attributes?.className as string;

    const faqItems = innerBlocks.filter((b) => b.name === 'flatwp/faq-item');

    const themeClasses = theme === 'light' ? 'bg-white' : 'bg-gray-900/50';
    const itemThemeClasses = theme === 'light'
        ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800';

    return (
        <section className={cn('py-16 md:py-24', themeClasses, className)}>
            <div className="max-w-3xl mx-auto px-6">
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
                <div className="space-y-4">
                    {faqItems.map((item, index) => {
                        const question = item.attributes?.question as string;
                        const answer = item.attributes?.answer as string;
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={item.clientId || index}
                                className={cn('rounded-xl border transition-all duration-300', itemThemeClasses)}
                            >
                                <button
                                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-medium text-lg">{question}</span>
                                    <ChevronDown
                                        className={cn(
                                            'w-5 h-5 text-gray-400 transition-transform duration-300 ease-out flex-shrink-0',
                                            isOpen && 'rotate-180'
                                        )}
                                    />
                                </button>
                                {/* Smooth height animation using grid */}
                                <div
                                    className={cn(
                                        'grid transition-all duration-300 ease-out',
                                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div
                                            className="px-6 pb-5 text-gray-400 prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: answer || '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
