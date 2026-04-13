# The bgx Lens — Project Rules

## Overview
Personal blog built with Astro 5 + Tailwind CSS 4 + custom design tokens. Zero AstroWind code remains.

## Tech Stack
- Astro 5.12, Tailwind CSS 4, TypeScript
- ExpressiveCode for syntax-highlighted code blocks with macOS frames
- Pagefind for static search
- Chart.js for data visualization (vanilla JS, no React)
- Klaro for cookie consent

## Running
- `npm run dev` — Start dev server
- `npm run build` — Production build (includes Pagefind indexing)
- `npm run check` — Astro check + ESLint + Prettier
- `npm run lint` — ESLint only
- `npm run lint:md` — Markdown lint

## Architecture
```
src/
  styles/        # Design system: tokens.css, global.css, animations.css, nav.css, footer.css
  lib/           # Utilities: blog.ts (data layer), constants.ts (config), frontmatter.ts (plugins)
  layouts/       # Layout.astro (base HTML), PageLayout.astro (header+footer wrapper)
  components/
    shared/      # Header, Footer, ThemeToggle, SearchButton
    blog/        # PostCard, PostList, PostContent, Pagination, RelatedPosts, TagCloud, EPSSChart
  pages/         # File-based routing
  posts/         # Markdown/MDX blog posts (YYYY-MM-DD-slug.md)
  assets/        # Images, favicons
```

## Styling Rules (CRITICAL)
- **ZERO inline styles** — All styling through CSS classes and design tokens
- **ZERO hardcoded colors** — Use `--color-*`, `--glass-*` CSS custom properties only
- **ZERO Tailwind default palette** — No blue-500, gray-400, etc. Use semantic tokens
- **ZERO raw shadows** — Use `--glass-shadow` system
- **CSS classes for everything** — glass-card, btn-primary, btn-ghost, tag-chip, category-badge, etc.
- ESLint enforces all of the above with no-restricted-syntax rules

## Content Conventions
- Blog posts in `src/posts/` with `YYYY-MM-DD-slug-name.md` naming
- Frontmatter: publishDate, title, excerpt, image, category, tags, featured, draft
- Categories: Security, AI, Automation, Tutorial
- Draft posts prefixed with `_` (gitignored)

## Security
- Pre-push hooks: gitleaks, Semgrep, Trivy, npm audit
- CI: Same security scans in GitHub Actions
- Headers: CSP, HSTS, X-Frame-Options, Permissions-Policy
- Robots: Block AI training crawlers, allow AI search bots

## Git Rules
- Never commit without explicit approval
- Never push without explicit approval
- Feature branches for non-trivial changes
