import { describe, expect, it } from "vitest";
import { blogPosts, getBlogPostBySlug } from "@/lib/content/blog";
import { assertMarketingCopySafe } from "@/lib/compliance";

describe("blog content", () => {
  it("exposes 5 long-form posts", () => {
    expect(blogPosts).toHaveLength(5);
  });

  it("every post has a unique slug", () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(blogPosts.length);
  });

  it("every post has title + summary + ISO date + author + excerpt", () => {
    for (const p of blogPosts) {
      expect(p.title).toMatch(/.+/);
      expect(p.summary).toMatch(/.+/);
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.author).toMatch(/.+/);
      expect(p.excerpt).toMatch(/.+/);
    }
  });

  it("getBlogPostBySlug resolves known slug", () => {
    expect(getBlogPostBySlug("reading-a-coa")).toBeDefined();
  });

  it("getBlogPostBySlug returns undefined for unknown slug", () => {
    expect(getBlogPostBySlug("nonexistent-slug")).toBeUndefined();
  });

  describe("long-form requirements", () => {
    it.each(blogPosts.map((p) => [p.slug, p]))(
      "%s has at least 1500 words in body sections",
      (_slug, post) => {
        const allText = post.sections
          .flatMap((s) => [s.heading ?? "", ...s.paragraphs])
          .join(" ");
        const wordCount = allText.split(/\s+/).filter(Boolean).length;
        expect(wordCount).toBeGreaterThanOrEqual(1500);
        expect(wordCount).toBeLessThanOrEqual(2400);
      },
    );

    it.each(blogPosts.map((p) => [p.slug, p]))(
      "%s has at least 5 citations",
      (_slug, post) => {
        expect(post.citations.length).toBeGreaterThanOrEqual(5);
      },
    );

    it.each(blogPosts.map((p) => [p.slug, p]))(
      "%s body passes assertMarketingCopySafe",
      (_slug, post) => {
        const allBody = [
          post.title,
          post.summary,
          post.excerpt,
          ...post.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs]),
          ...post.citations.map((c) => c.text),
        ].join("\n\n");
        expect(() => assertMarketingCopySafe(allBody)).not.toThrow();
      },
    );

    it.each(blogPosts.map((p) => [p.slug, p]))(
      "%s every citation has an id and non-empty text",
      (_slug, post) => {
        for (const c of post.citations) {
          expect(c.id).toMatch(/.+/);
          expect(c.text.length).toBeGreaterThan(20);
        }
      },
    );
  });
});
