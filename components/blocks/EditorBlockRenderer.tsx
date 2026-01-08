/**
 * EditorBlockRenderer
 * Server-first block renderer that maps WordPress blocks to React components
 * Uses renderedHtml fallback for unsupported blocks
 */

import type { EditorBlock } from '@/lib/wordpress';
import { HeroBlock } from './Hero';
import { FeaturesBlock } from './Features';
import { CtaBlock } from './Cta';
import { CardBlock } from './Card';
import { LogoRowBlock } from './LogoRow';
import { FaqBlock } from './Faq';
import { StatisticsBlock } from './Statistics';
import { PricingColumnBlock } from './PricingColumn';
import { TeamBlock, TeamMemberBlock } from './Team';
import { ImageTextBlock } from './ImageText';
import { SectionBlock } from './Section';

// Block component registry
const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ block: EditorBlock; allBlocks?: EditorBlock[] }>> = {
    // FlatWP blocks
    'flatwp/hero': HeroBlock,
    'flatwp/hero-minimal': HeroBlock,  // Variant alias
    'flatwp/hero-split': HeroBlock,    // Variant alias
    'flatwp/features': FeaturesBlock,
    'flatwp/cta': CtaBlock,
    'flatwp/card': CardBlock,
    'flatwp/logo-row': LogoRowBlock,
    'flatwp/faq': FaqBlock,
    'flatwp/statistics': StatisticsBlock,
    'flatwp/pricing-column': PricingColumnBlock,
    'flatwp/team': TeamBlock,
    'flatwp/team-member': TeamMemberBlock,
    'flatwp/image-text': ImageTextBlock,
    'flatwp/section': SectionBlock,
};

// Blocks that should use renderedHtml (WordPress core blocks + wrapper blocks)
const USE_RENDERED_HTML = new Set([
    // Core WordPress blocks
    'core/paragraph',
    'core/heading',
    'core/image',
    'core/list',
    'core/quote',
    'core/code',
    'core/preformatted',
    'core/pullquote',
    'core/table',
    'core/verse',
    'core/separator',
    'core/spacer',
    'core/html',
    'core/embed',
    'core/video',
    'core/audio',
    'core/file',
    'core/gallery',
    'core/media-text',
    'core/cover',
    'core/group',
    'core/columns',
    'core/column',
    'core/buttons',
    'core/button',
    // FlatWP wrapper/utility blocks (render server HTML)
    'flatwp/icon-text',
    'flatwp/feature-item',
    'flatwp/faq-item',
    'flatwp/stat-item',
]);

interface EditorBlockRendererProps {
    blocks: EditorBlock[];
}

export function EditorBlockRenderer({ blocks }: EditorBlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    // Build parent-child relationships for nested blocks
    // We clone the blocks to avoid mutating the original read-only objects
    const mutableBlocks = blocks.map(block => ({ ...block }));
    const blockMap = new Map<string, EditorBlock>();
    const rootBlocks: EditorBlock[] = [];

    mutableBlocks.forEach((block) => {
        if (block.clientId) {
            blockMap.set(block.clientId, block);
        }
        if (!block.parentClientId) {
            rootBlocks.push(block);
        }
    });

    // Attach inner blocks to their parents
    mutableBlocks.forEach((block) => {
        if (block.parentClientId) {
            const parent = blockMap.get(block.parentClientId);
            if (parent) {
                if (!parent.innerBlocks) {
                    parent.innerBlocks = [];
                }
                parent.innerBlocks.push(block);
            }
        }
    });

    return (
        <div className="flatwp-blocks">
            {rootBlocks.map((block, index) => (
                <BlockRenderer
                    key={block.clientId || `block-${index}`}
                    block={block}
                    allBlocks={mutableBlocks}
                />
            ))}
        </div>
    );
}

interface BlockRendererProps {
    block: EditorBlock;
    allBlocks: EditorBlock[];
}

function BlockRenderer({ block, allBlocks }: BlockRendererProps) {
    const { name, renderedHtml } = block;

    // Check for FlatWP block component
    const Component = BLOCK_COMPONENTS[name];
    if (Component) {
        return <Component block={block} allBlocks={allBlocks} />;
    }

    // Use renderedHtml for core WordPress blocks
    if (USE_RENDERED_HTML.has(name) && renderedHtml) {
        return (
            <div
                className="wp-block-rendered prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Fallback: try renderedHtml for any block
    if (renderedHtml) {
        return (
            <div
                className="wp-block-rendered"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    }

    // Unknown block with no renderedHtml - show debug info in development
    if (process.env.NODE_ENV === 'development') {
        return (
            <div className="p-4 my-4 border-2 border-dashed border-yellow-500 bg-yellow-500/10 rounded-lg">
                <p className="text-sm text-yellow-500 font-mono">Unknown block: {name}</p>
                <pre className="text-xs text-yellow-400/70 mt-2 overflow-auto">
                    {JSON.stringify(block.attributes, null, 2)}
                </pre>
            </div>
        );
    }

    return null;
}

export default EditorBlockRenderer;
