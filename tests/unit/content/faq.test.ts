import { describe, expect, it } from 'vitest';
import { faqEntries } from '@/lib/content/faq';

describe('FAQ content', () => {
  it('exposes exactly 20 entries (Appendix M)', () => {
    expect(faqEntries).toHaveLength(20);
  });

  it('every entry has non-empty question and answer', () => {
    for (const e of faqEntries) {
      expect(e.q).toMatch(/.+\?$/);
      expect(e.a.length).toBeGreaterThan(20);
    }
  });

  it('substitutes Vialchems Labs for the brand placeholder', () => {
    const allCopy = faqEntries.map((e) => `${e.q} ${e.a}`).join(' ');
    expect(allCopy).toContain('Vialchems Labs');
    expect(allCopy).not.toContain('{{BRAND_NAME}}');
    expect(allCopy).not.toContain('{{LAB_PARTNER}}');
    expect(allCopy).not.toContain('{{SITE_URL}}');
    expect(allCopy).not.toContain('{{BRAND_DOMAIN}}');
  });

  it('Q5 references Janoshik Analytical', () => {
    expect(faqEntries[4].a).toContain('Janoshik Analytical');
  });
});
