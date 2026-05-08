import { describe, expect, it } from 'vitest';
import { blogPosts, getBlogPostBySlug } from '@/lib/content/blog';

describe('blog content', () => {
  it('exposes 5 placeholder posts', () => {
    expect(blogPosts).toHaveLength(5);
  });

  it('every post has a unique slug', () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(blogPosts.length);
  });

  it('every post has title + summary + ISO date', () => {
    for (const p of blogPosts) {
      expect(p.title).toMatch(/.+/);
      expect(p.summary).toMatch(/.+/);
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('getBlogPostBySlug resolves known slug', () => {
    expect(getBlogPostBySlug('reading-a-coa')).toBeDefined();
  });

  it('getBlogPostBySlug returns undefined for unknown slug', () => {
    expect(getBlogPostBySlug('nonexistent-slug')).toBeUndefined();
  });
});
