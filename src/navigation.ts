import { getPermalink, getAsset } from './utils/permalinks';
//import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Category',
      links: [
        {
          text: 'Security',
          href: getPermalink('security', 'category'),
        },
        {
          text: 'AI',
          href: getPermalink('ai', 'category'),
        },
        {
          text: 'Tutorial',
          href: getPermalink('tutorial', 'category'),
        },
      ],
    },
    {
      text: 'Tags',
      href: getPermalink('tags'),
    },
    {
      text: 'About me',
      href: getPermalink('/personal'),
    },
  ],
  //actions: [{ text: 'Download', href: 'https://github.com/onwidget/astrowind', target: '_blank' }],
};

export const footerData = {
  socialLinks: [
    {
      ariaLabel: 'Github',
      icon: 'tabler:brand-github',
      href: 'https://github.com/bgx4k3p',
    },
    {
      ariaLabel: 'LinkedIn',
      icon: 'tabler:brand-linkedin',
      href: 'https://www.linkedin.com/in/chukalov/',
    },
    //{ ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  // links: [
  //   // ... your links
  // ],
  // secondaryLinks: [
  //   // ... your secondary links
  // ],
  footNote: `
    Powered by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/onwidget/astrowind">AstroWind</a>
  `,
};
