# FlatWP Starter

A modern, production-ready Next.js starter for headless WordPress. Build blazing-fast websites with WordPress as your CMS and Next.js as your frontend.

## Features

- **Next.js 15** - App Router, React Server Components, streaming
- **Gutenberg Block Rendering** - Custom block components with HTML fallback
- **Full Blog System** - Archive, single posts, categories, tags, pagination
- **Search** - Full-text search across all content types with filters
- **Form Support** - WPForms integration with proxy submission handling
- **Preview Mode** - Live preview of draft content from WordPress
- **ISR** - Incremental Static Regeneration with on-demand revalidation
- **Dark Mode** - Tailwind CSS with dark theme out of the box
- **TypeScript** - Full type safety throughout

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- WordPress with [WPGraphQL](https://www.wpgraphql.com/) plugin
- [FlatWP Plugin](https://github.com/flatwp/flatwp-plugin) installed on WordPress

### 1. Clone the Repository

```bash
git clone https://github.com/flatwp/flatwp-starter.git
cd flatwp-starter
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your WordPress details:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_WORDPRESS_DOMAIN=your-wordpress-site.com
FLATWP_SECRET=your-secret-key-here
```

> Generate a secret with: `openssl rand -base64 32`

### 4. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## WordPress Setup

### Required Plugins

1. **WPGraphQL** - Exposes WordPress data via GraphQL
2. **FlatWP Plugin** - Handles preview mode, revalidation, and block rendering

### FlatWP Plugin Configuration

In WordPress admin, go to **Settings > FlatWP** and configure:

| Setting | Value |
|---------|-------|
| Frontend URL | Your Next.js URL (e.g., `http://localhost:3000`) |
| API Secret | Same value as `FLATWP_SECRET` in your `.env.local` |
| Redirect Frontend | Enable to route all traffic through Next.js |

## Project Structure

```
flatwp-starter/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── forms/            # Form submission handlers
│   │   ├── preview/          # Preview mode
│   │   ├── revalidate/       # ISR revalidation
│   │   └── search/           # Search API
│   ├── blog/                 # Blog pages
│   ├── search/               # Search page
│   └── [...slug]/            # Dynamic page routes
├── components/
│   ├── blocks/               # Gutenberg block renderers
│   ├── blog/                 # Blog components
│   ├── layout/               # Header, Footer
│   └── search/               # Search components
└── lib/
    ├── config/               # Site configuration
    └── wordpress/            # GraphQL client & queries
```

## Configuration

All configuration is in `lib/config/`:

| File | Purpose |
|------|---------|
| `site.config.ts` | Site name, SEO, branding |
| `navigation.config.ts` | Menu items and structure |
| `blog.config.ts` | Blog layout and features |
| `layout.config.ts` | Page widths, footer settings |
| `search.config.ts` | Search behavior |
| `forms.config.ts` | Form plugin settings |

### Example: Customizing Site Info

```typescript
// lib/config/site.config.ts
export const siteConfig = {
    name: 'My Awesome Site',
    description: 'Built with FlatWP',
    // ...
};
```

## Block Rendering

FlatWP uses a hybrid approach for Gutenberg blocks:

1. **Custom Components** - React components for FlatWP blocks
2. **HTML Fallback** - Server-rendered HTML for core WordPress blocks

### Adding Custom Blocks

1. Create a component in `components/blocks/`:

```typescript
// components/blocks/MyBlock.tsx
export function MyBlock({ block }: { block: EditorBlock }) {
    const { attributes } = block;
    return <div>{attributes.content}</div>;
}
```

2. Register in `EditorBlockRenderer.tsx`:

```typescript
const BLOCK_COMPONENTS = {
    'my-plugin/my-block': MyBlock,
    // ...
};
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Set these in your hosting platform:

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wp.com/graphql
NEXT_PUBLIC_WORDPRESS_DOMAIN=your-wp.com
NEXT_PUBLIC_SITE_URL=https://your-frontend.com
FLATWP_SECRET=your-production-secret
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |

## Troubleshooting

### "Cannot find module" Error After Updates

Clear the Next.js cache:

```bash
rm -rf .next && pnpm dev
```

### Forms Not Submitting

1. Ensure WPForms is installed and configured in WordPress
2. Check that the form has AJAX submission enabled
3. Verify CORS headers are set in WordPress

### Preview Not Working

1. Verify `FLATWP_SECRET` matches between Next.js and WordPress
2. Check the Frontend URL is correct in FlatWP plugin settings
3. Ensure the WordPress user is logged in

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [FlatWP Documentation](https://flatwp.com/docs)
- [FlatWP Plugin](https://github.com/flatwp/flatwp-plugin)
- [WPGraphQL](https://www.wpgraphql.com/)
- [Next.js Documentation](https://nextjs.org/docs)
