# FlatWP Starter

A clean, minimal Next.js starter template for FlatWP - the headless WordPress framework.

## 🚀 Features

- **Next.js 15** with App Router and React Server Components
- **Gutenberg Block Rendering** - Server-first block components
- **Blog System** - Archive, single post, categories, tags
- **Preview Mode** - Draft content preview from WordPress
- **Configurable** - Hybrid config system for easy customization
- **Tailwind CSS** - Dark mode styling out of the box

## 📦 Quick Start

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your WordPress GraphQL URL

# Start development server
pnpm dev
```

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | WordPress GraphQL endpoint (e.g., `https://your-wp.com/graphql`) |
| `FLATWP_SECRET` | Secret key for preview mode validation |
| `NEXT_PUBLIC_SITE_URL` | Your frontend URL (e.g., `https://demo.flatwp.com`) |

## 📁 Project Structure

```
apps/starter/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (preview, revalidate)
│   ├── blog/              # Blog pages
│   └── [...slug]/         # Dynamic page routes
├── components/
│   ├── blocks/            # Gutenberg block renderers
│   ├── blog/              # Blog components
│   └── layout/            # Header, Footer
└── lib/
    ├── config/            # Site configuration
    └── wordpress/         # GraphQL client & queries
```

## 🎨 Customization

Edit the config files in `lib/config/`:

- `site.config.ts` - Site name, SEO, branding
- `navigation.config.ts` - Menu items and sources
- `blog.config.ts` - Blog layout and features
- `layout.config.ts` - Page widths, footer settings

## 📖 Documentation

See the [FlatWP Documentation](https://flatwp.com/docs) for full guides.

## License

MIT
