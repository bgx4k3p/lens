# The bgx Lens

Personal blog covering cybersecurity, vulnerability management, AI, automation, and infrastructure topics.

## Tech Stack

- **Framework**: Astro 5 + TypeScript
- **Styling**: Tailwind CSS 4 + custom design tokens
- **Code Blocks**: Expressive Code (macOS-style frames)
- **Search**: Pagefind (static search index)
- **Deployment**: Cloudflare Pages
- **Linting**: ESLint (strict design token enforcement) + Prettier + markdownlint
- **Security**: gitleaks + Semgrep + Trivy (CI/CD)
- **Consent**: Klaro (self-hosted, opt-in)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Quality

```bash
npm run check      # Astro check + ESLint + Prettier
npm run lint       # ESLint only
npm run lint:md    # Markdown lint
npm run format     # Auto-fix formatting
```

## License

MIT
