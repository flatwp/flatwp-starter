/**
 * WordPress GraphQL Types
 */

export interface Post {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt?: string;
    content?: string;
    isSticky?: boolean;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText?: string;
            mediaDetails?: {
                width?: number;
                height?: number;
            };
        };
    };
    author?: {
        node: {
            name: string;
            avatar?: {
                url: string;
            };
        };
    };
    categories?: {
        nodes: Category[];
    };
    tags?: {
        nodes: Tag[];
    };
}

export interface Page {
    id: string;
    databaseId?: number;
    title: string;
    slug: string;
    content?: string;
    date?: string;
    modified?: string;
    uri?: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText?: string;
            mediaDetails?: {
                width?: number;
                height?: number;
            };
        };
    };
    flatwpSettings?: {
        hideTitle?: boolean;
        containerWidth?: string;
        hideHeader?: boolean;
        hideFooter?: boolean;
        customCssClass?: string;
    };
    editorBlocks?: EditorBlock[];
}

export interface EditorBlock {
    name: string;
    clientId: string;
    parentClientId?: string;
    renderedHtml?: string;
    attributes?: Record<string, unknown>;
    innerBlocks?: EditorBlock[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    count?: number;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    count?: number;
}

export interface MenuItem {
    id: string;
    title: string;
    url: string;
    parentId?: string;
    flatwpIcon?: string;
    flatwpBadge?: string;
}

export interface MenuItemsResponse {
    menuItems: {
        nodes: MenuItem[];
    };
}
