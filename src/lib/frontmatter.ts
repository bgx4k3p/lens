// src/lib/frontmatter.ts
// Remark/rehype plugins for reading time, responsive tables, lazy images
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export const readingTimeRemarkPlugin = () => {
  return function (tree: any, file: any) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);
    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin = () => {
  return function (tree: any) {
    if (!tree.children) return;
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: { class: 'table-responsive' },
          children: [child],
        };
        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin = () => {
  return function (tree: any) {
    if (!tree.children) return;
    visit(tree, 'element', function (node: any) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};
