// src/lib/blog.ts
// Blog data layer — fetches, filters, paginates posts
import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { BLOG, SITE } from './constants';

export interface Post {
  id: string;
  slug: string;
  permalink: string;
  publishDate: Date;
  updateDate?: Date;
  title: string;
  excerpt?: string;
  image?: string;
  resolvedImage?: ImageMetadata;
  category?: { slug: string; title: string };
  tags: { slug: string; title: string }[];
  author?: string;
  draft: boolean;
  featured: boolean;
  Content?: any;
  readingTime?: number;
}

type ImageMetadata = { src: string; width: number; height: number; format: string };

const imageImports = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.{png,jpg,jpeg,gif,webp,svg}',
  { eager: true }
);

const resolveImage = (imagePath?: string): ImageMetadata | undefined => {
  if (!imagePath) return undefined;
  const normalized = imagePath.replace('~/assets/images/', '/src/assets/images/');
  const match = imageImports[normalized];
  return match?.default;
};

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

const generatePermalink = (slug: string): string => {
  return BLOG.postPermalink.replace('%slug%', slug);
};

const normalizePost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    featured = false,
  } = data;

  const slug = slugify(id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, ''));
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? { slug: slugify(rawCategory), title: rawCategory }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: slugify(tag),
    title: tag,
  }));

  return {
    id,
    slug,
    permalink: generatePermalink(slug),
    publishDate,
    updateDate,
    title,
    excerpt,
    image,
    resolvedImage: resolveImage(image),
    category,
    tags,
    author,
    draft,
    featured,
    Content,
    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

let _posts: Post[];

export const fetchPosts = async (): Promise<Post[]> => {
  if (!_posts) {
    const posts = await getCollection('post');
    const normalized = posts.map((post) => normalizePost(post));
    _posts = (await Promise.all(normalized))
      .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
      .filter((post) => !post.draft);
  }
  return _posts;
};

export const findLatestPosts = async (count = 4): Promise<Post[]> => {
  const posts = await fetchPosts();
  return posts.slice(0, count);
};

export const findFeaturedPosts = async (count = 5): Promise<Post[]> => {
  const posts = await fetchPosts();
  return posts.filter((p) => p.featured).slice(0, count);
};

export const getStaticPathsBlogList = async ({ paginate }: { paginate: PaginateFunction }) => {
  return paginate(await fetchPosts(), {
    params: { blog: undefined },
    pageSize: BLOG.postsPerPage,
  });
};

export const getStaticPathsBlogPost = async () => {
  return (await fetchPosts()).flatMap((post) => ({
    params: { blog: post.permalink.replace(/^\//, '') },
    props: { post },
  }));
};

export const getStaticPathsBlogCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  const posts = await fetchPosts();
  const categories: Record<string, { slug: string; title: string }> = {};
  posts.forEach((post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });

  return Object.keys(categories).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug === categorySlug),
      {
        params: { category: categorySlug, blog: BLOG.categoryBase || undefined },
        pageSize: BLOG.postsPerPage,
        props: { category: categories[categorySlug] },
      },
    ),
  );
};

export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  const posts = await fetchPosts();
  const tags: Record<string, { slug: string; title: string }> = {};
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      tags[tag.slug] = tag;
    });
  });

  return Object.keys(tags).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => (post.tags || []).some((t) => t.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: BLOG.tagBase || undefined },
        pageSize: BLOG.postsPerPage,
        props: { tag: tags[tagSlug] },
      },
    ),
  );
};

export const getRelatedPosts = async (originalPost: Post, maxResults = 4): Promise<Post[]> => {
  const allPosts = await fetchPosts();
  const originalTagSlugs = new Set((originalPost.tags || []).map((t) => t.slug));

  const scored = allPosts
    .filter((p) => p.slug !== originalPost.slug)
    .map((post) => {
      let score = 0;
      if (post.category && originalPost.category && post.category.slug === originalPost.category.slug) {
        score += 5;
      }
      (post.tags || []).forEach((tag) => {
        if (originalTagSlugs.has(tag.slug)) score += 1;
      });
      return { post, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map((s) => s.post);
};

export const getPermalink = (slug = '', type = 'page'): string => {
  if (slug.startsWith('http') || slug.startsWith('#')) return slug;

  const base = SITE.base.replace(/\/$/, '');

  let result: string;
  switch (type) {
    case 'category':
      result = `${base}/${BLOG.categoryBase}/${slugify(slug)}`;
      break;
    case 'tag':
      result = `${base}/${BLOG.tagBase}/${slugify(slug)}`;
      break;
    case 'post':
      result = `${base}${slug.startsWith('/') ? slug : '/' + slug}`;
      break;
    case 'page':
    default:
      result = `${base}${slug.startsWith('/') ? slug : '/' + slug}`;
      break;
  }
  // Never return trailing slashes
  return result.replace(/\/$/, '') || base;
};

export const getCanonical = (path = ''): string => {
  return String(new URL(path, SITE.site)).replace(/\/$/, '');
};
