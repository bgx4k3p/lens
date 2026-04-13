// src/lib/constants.ts
// Site configuration — replaces config.yaml + astrowind:config

export const SITE = {
  name: 'The bgx Lens',
  site: 'https://bgx4k3p.github.io',
  base: '/lens',
  description: 'Solving complex InfoSec & Tech challenges with practical advice and strategic expertise.',
  googleSiteVerificationId: 'ohgRd2HRHS4nUnLmLzuyjuQRiCGcNvPfBQxs11D0rV4',
  googleAnalyticsId: 'G-X1GDCLQGXH',
} as const;

export const BLOG = {
  postsPerPage: 6,
  postPermalink: '/%slug%',
  categoryBase: 'category',
  tagBase: 'tag',
} as const;

export const CATEGORIES = ['Security', 'AI', 'Automation', 'Tutorial'] as const;

export const NAV_LINKS = [
  { text: 'Home', href: `${SITE.base}` },
  {
    text: 'Category',
    children: [
      { text: 'Security', href: `${SITE.base}/category/security` },
      { text: 'AI', href: `${SITE.base}/category/ai` },
      { text: 'Automation', href: `${SITE.base}/category/automation` },
      { text: 'Tutorial', href: `${SITE.base}/category/tutorial` },
    ],
  },
  { text: 'Tags', href: `${SITE.base}/tags` },
  { text: 'About me', href: `${SITE.base}/bio` },
] as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/bgx4k3p',
  linkedin: 'https://www.linkedin.com/in/chukalov/',
  email: 'bgx4k3p@gmail.com',
} as const;
