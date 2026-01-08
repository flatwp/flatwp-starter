/**
 * Statistics Block (Client Component)
 * Animated counters with intersection observer
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';
import { getIcon } from './icons';

interface StatisticsBlockProps {
    block: EditorBlock;
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Parse the numeric value
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const hasPlus = value.includes('+');
    const hasK = value.toLowerCase().includes('k');
    const hasM = value.toLowerCase().includes('m');
    const hasPercent = value.includes('%');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, numericValue]);

    const displayValue = `${prefix}${count}${hasK ? 'K' : ''}${hasM ? 'M' : ''}${hasPercent ? '%' : ''}${hasPlus ? '+' : ''}${suffix}`;

    return (
        <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500">
            {displayValue}
        </div>
    );
}

export function StatisticsBlock({ block }: StatisticsBlockProps) {
    const { attributes, innerBlocks = [] } = block;

    const heading = attributes?.heading as string;
    const description = attributes?.description as string;
    const columns = (attributes?.columns as string) || '4';
    const theme = (attributes?.theme as string) || 'dark';
    const className = attributes?.className as string;

    const statItems = innerBlocks.filter((b) => b.name === 'flatwp/stat-item');

    const themeClasses = theme === 'light'
        ? 'bg-gray-50 text-gray-900'
        : 'bg-gray-900/50 text-white';

    return (
        <section className={cn('py-16 md:py-24', themeClasses, className)}>
            <div className="max-w-6xl mx-auto px-6">
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{heading}</h2>
                )}
                {description && (
                    <p className="text-lg text-gray-400 text-center mb-12 max-w-2xl mx-auto">{description}</p>
                )}
                <div className={cn(
                    'grid grid-cols-2 gap-8 md:gap-12',
                    columns === '3' && 'md:grid-cols-3',
                    columns === '4' && 'md:grid-cols-4'
                )}>
                    {statItems.map((item, index) => {
                        const value = item.attributes?.value as string;
                        const label = item.attributes?.label as string;
                        const icon = item.attributes?.icon as string;
                        const IconComponent = icon ? getIcon(icon) : null;

                        return (
                            <div key={item.clientId || index} className="text-center">
                                {IconComponent && (
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-4">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                )}
                                <AnimatedCounter value={value || '0'} />
                                <div className="text-gray-400 mt-2 font-medium">{label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
