import rss from '@astrojs/rss';
import { fetchPosts } from '~/lib/blog';
import { SITE } from '~/lib/constants';

export async function GET(context: any) {
  const posts = await fetchPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishDate,
      description: post.excerpt || '',
      link: `${SITE.base}${post.permalink}`,
    })),
  });
}
