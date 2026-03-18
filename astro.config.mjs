// astro.config.mjs
// Astro 5 configuration for The bgx Lens blog
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/lib/frontmatter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkCustomHeadingId from 'remark-custom-heading-id';

export default defineConfig({
  site: 'https://bgx4k3p.github.io',
  base: '/lens',
  trailingSlash: 'never',

  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname,
      },
    },
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, remarkCustomHeadingId],
    rehypePlugins: [
      rehypeSlug,
      responsiveTablesRehypePlugin,
      lazyImagesRehypePlugin,
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { class: 'anchor-link' } }],
    ],
  },

  integrations: [
    expressiveCode({
      themes: ['one-dark-pro'],
      frames: {
        showCopyToClipboardButton: true,
      },
      styleOverrides: {
        codeBackground: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
        borderRadius: '0.75rem',
        codeFontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        uiFontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
        frames: {
          editorTabBarBorderBottomColor: 'var(--color-border)',
          terminalTitlebarDotsOpacity: '1',
        },
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      priority: 0.7,
      changefreq: 'monthly',
    }),
  ],
});
