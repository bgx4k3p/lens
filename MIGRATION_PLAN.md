# Migration Plan: The bgx Lens → Engenso.com

## Overview

Rebrand and expand the existing blog codebase into the Engenso LLC company website.
The blog infrastructure, design system, and tooling carry over as-is. New pages are
added for company presence (home, services, products, about, contact).

Deployment moves from GitHub Pages (`bgx4k3p.github.io/lens`) to Cloudflare Pages (`engenso.com`).

---

## Phase 1 — Rebrand & Config

Remove all "bgx Lens" / GitHub Pages references and point at the new domain.

- [ ] Rename package: `bgx-lens` → `engenso-website`
- [ ] `astro.config.mjs`: set `site: 'https://engenso.com'`, remove `base: '/lens'`
- [ ] `src/lib/constants.ts`: update SITE name, description, domain, social links
- [ ] Update branding in Header (logo text), Footer (copyright, links), Layout (meta tags)
- [ ] Remove all hardcoded `/lens/` path prefixes (SearchButton, Pagefind, any links)
- [ ] Update `public/_headers` if any paths reference `/lens/`
- [ ] Update `public/robots.txt` sitemap URL
- [ ] Update RSS feed metadata

## Phase 2 — Analytics Swap

Replace Google Analytics + Klaro with Cloudflare Web Analytics (cookieless, no consent needed).

- [ ] Remove Klaro config and consent banner from `Layout.astro`
- [ ] Remove GA `gtag` script and `dataLayer` stub from `Layout.astro`
- [ ] Remove `src/styles/klaro.css` and its import from `global.css`
- [ ] Remove `public/vendor/klaro.min.js`
- [ ] Add Cloudflare Web Analytics snippet to `Layout.astro` (single `<script>` tag)
- [ ] Respect `navigator.globalPrivacyControl` / `doNotTrack` (match accloiq pattern)

## Phase 3 — New Pages

Add company pages. All use existing design system (glass cards, tokens, fluid type).

### 3a — Home (`src/pages/index.astro`)

Replace the current blog listing homepage with a company landing page:
- Hero: company name, tagline, CTA buttons (Services, Contact)
- Services preview: 3 cards linking to /services
- Products preview: 2 cards linking to /products
- Latest posts: 3 most recent blog posts
- Brief about section with link to /about

### 3b — Services (`src/pages/services.astro`)

Single page with sections for each practice area:
- Strategic Transformation
- Cybersecurity & Audit Advisory
- AI Engineering
- Each section: headline, description, key deliverables, CTA to /contact

### 3c — Products (`src/pages/products.astro`)

Cards for each product linking to their own domains:
- AccloIQ (accloiq.com) — brief description + link
- VulnCompass-NG — brief description + link

### 3d — About (`src/pages/about.astro`)

Replace current `bio.astro`:
- Professional background and expertise
- Company story / mission
- Credentials and experience

### 3e — Contact (`src/pages/contact.astro`)

- Contact form or mailto link
- Social links (GitHub, LinkedIn)
- Optional: Calendly/booking embed for consulting inquiries

### 3f — Blog index (`src/pages/blog/[...page].astro`)

Move blog listing from root (`/`) to `/blog/`:
- Relocate current `[...blog]/` route files under `blog/`
- Category pages: `/blog/category/[...page].astro`
- Tag pages: `/blog/tag/[...page].astro`
- Individual posts: `/blog/[slug].astro`

## Phase 4 — Navigation

Update nav to match new site structure:

```
[Engenso]    Services ▾    Products ▾    Blog    About    Contact
```

- [ ] Update `Header.astro` nav links
- [ ] Add dropdowns for Services (sub-items) and Products (AccloIQ, VulnCompass)
- [ ] Update mobile menu with same structure
- [ ] Update `Footer.astro` link columns

## Phase 5 — Deployment

### Cloudflare Pages setup
- [ ] Add `engenso.com` custom domain to `bgx-lens` CF Pages project (or rename project to `engenso-website`)
- [ ] Configure DNS: CNAME `engenso.com` → CF Pages
- [ ] Configure DNS: CNAME `www.engenso.com` → redirect to apex
- [ ] Enable Cloudflare Web Analytics in dashboard
- [ ] Verify `_headers` security headers are served correctly

### GitHub Actions
- [ ] Update `.github/workflows/deploy.yml` project name if renamed
- [ ] Verify CI workflow still passes with new config
- [ ] Remove any GitHub Pages-specific config

### Post-deploy verification
- [ ] All pages render correctly
- [ ] Blog posts and images load
- [ ] Pagefind search works (builds index at root, no `/lens/` prefix)
- [ ] RSS feed valid at `/rss.xml`
- [ ] Sitemap valid at `/sitemap-index.xml`
- [ ] Security headers present (CSP, HSTS, X-Frame-Options)
- [ ] Cloudflare Web Analytics receiving data
- [ ] Old GitHub Pages URL returns 404 or redirect

## Phase 6 — Cleanup

- [ ] Remove `base` references from CLAUDE.md project docs
- [ ] Update README with new project name and domain
- [ ] Delete any leftover AstroWind artifacts if found
- [ ] Final visual QA pass against accloiq for consistency

---

## Files Changed Summary

| Action | Files |
|--------|-------|
| **Modify** | astro.config.mjs, constants.ts, Layout.astro, Header.astro, Footer.astro, SearchButton.astro, global.css, deploy.yml, package.json, _headers, robots.txt, CLAUDE.md |
| **Remove** | klaro.css, klaro.min.js, bio.astro |
| **Add** | index.astro (new home), services.astro, products.astro, about.astro, contact.astro |
| **Move** | `[...blog]/` routes → `blog/` routes |

## Out of Scope (for now)

- Blog post content rewrites (existing posts carry over as-is)
- Logo/favicon design (text logo for now, can add later)
- Contact form backend (start with mailto, add form handler later)
- Product page content (just cards linking to external domains)
