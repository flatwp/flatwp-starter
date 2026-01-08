/**
 * Team Block (Server Component)
 * Displays team members in a grid
 */

import Image from 'next/image';
import type { EditorBlock } from '@/lib/wordpress';
import { cn } from '@/lib/utils';

interface TeamBlockProps {
    block: EditorBlock;
}

export function TeamBlock({ block }: TeamBlockProps) {
    const { attributes, innerBlocks = [] } = block;

    const heading = attributes?.heading as string;
    const description = attributes?.description as string;
    const columns = (attributes?.columns as string) || '3';
    const theme = (attributes?.theme as string) || 'dark';
    const className = attributes?.className as string;

    const teamMembers = innerBlocks.filter(b => b.name === 'flatwp/team-member');

    const themeClasses = theme === 'light' ? 'bg-white' : 'bg-gray-900/50';

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
                    'grid grid-cols-1 md:grid-cols-2 gap-8',
                    columns === '3' && 'lg:grid-cols-3',
                    columns === '4' && 'lg:grid-cols-4'
                )}>
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={member.clientId || index} block={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface TeamMemberCardProps {
    block: EditorBlock;
}

function TeamMemberCard({ block }: TeamMemberCardProps) {
    const { attributes } = block;

    const name = attributes?.name as string;
    const role = attributes?.role as string;
    const bio = attributes?.bio as string;
    const photoUrl = attributes?.photoUrl as string;
    const linkedin = attributes?.linkedin as string;
    const twitter = attributes?.twitter as string;

    return (
        <div className="group text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/30 hover:border-blue-500/30 transition-all">
            {photoUrl && (
                <div className="relative w-28 h-28 mx-auto mb-4">
                    <Image
                        src={photoUrl}
                        alt={name || ''}
                        fill
                        className="rounded-full object-cover ring-4 ring-gray-700 group-hover:ring-blue-500/50 transition-all"
                    />
                </div>
            )}
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            {role && <p className="text-blue-400 text-sm mb-3">{role}</p>}
            {bio && <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>}
            {(linkedin || twitter) && (
                <div className="flex justify-center gap-4 mt-4">
                    {linkedin && (
                        <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            LinkedIn
                        </a>
                    )}
                    {twitter && (
                        <a
                            href={twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-sky-400 transition-colors"
                        >
                            Twitter
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

// Also export individual team member for direct use
export function TeamMemberBlock({ block }: TeamMemberCardProps) {
    return <TeamMemberCard block={block} />;
}
