/**
 * Site Configuration
 * Central configuration file that imports from specialized config modules
 */

import { siteConfig } from './site.config';
import { navigationConfig } from './navigation.config';
import { blogConfig } from './blog.config';
import { layoutConfig } from './layout.config';

export const config = {
    site: siteConfig,
    navigation: navigationConfig,
    blog: blogConfig,
    layout: layoutConfig,
} as const;

// Re-export individual configs for direct imports
export { siteConfig } from './site.config';
export { navigationConfig, type NavSource } from './navigation.config';
export { blogConfig, type ArchiveLayout, type SidebarPosition } from './blog.config';
export { layoutConfig, type PageWidth, type SidebarMode } from './layout.config';

// Export the unified config as default
export default config;
