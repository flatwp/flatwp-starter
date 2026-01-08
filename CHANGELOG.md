# Changelog

All notable changes to FlatWP Starter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-08

### Added

- **Next.js 15** with App Router and React Server Components
- **Gutenberg Block Rendering** - Hybrid approach with custom React components and HTML fallback
- **Blog System** - Full-featured blog with archive, single posts, categories, tags, and pagination
- **Search Functionality**
  - Full-text search across posts, pages, and custom post types
  - Dedicated search page with advanced filters (date range, category, tags)
  - Header search button with Cmd+K / Ctrl+K keyboard shortcut
  - Sidebar search widget for blog pages
  - Debounced live search with pagination
- **WPForms Integration**
  - Block rendering for WPForms forms
  - Proxy API for headless form submissions
  - Configurable styling (plugin defaults or custom Tailwind)
  - Form state management with loading, success, and error states
- **Preview Mode** - Live preview of draft content from WordPress admin
- **ISR Support** - Incremental Static Regeneration with on-demand revalidation
- **Dark Mode** - Tailwind CSS with dark theme styling
- **TypeScript** - Full type safety throughout the codebase
- **Configuration System** - Modular config files for site, navigation, blog, layout, search, and forms

### Block Components

- Hero (with variants: minimal, split)
- Features
- CTA (Call to Action)
- Card
- Logo Row
- FAQ
- Statistics
- Pricing Column
- Team / Team Member
- Image Text
- Section
- WPForms

### API Routes

- `/api/preview` - WordPress preview mode handler
- `/api/exit-preview` - Exit preview mode
- `/api/revalidate` - On-demand ISR revalidation
- `/api/search` - Search API endpoint
- `/api/forms/wpforms` - Form submission proxy
- `/api/health` - Health check endpoint

[1.0.0]: https://github.com/flatwp/flatwp-starter/releases/tag/v1.0.0
