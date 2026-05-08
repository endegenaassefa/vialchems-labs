/**
 * Verifies the Fuse.js client-side search configuration used by the COA
 * library page. The page itself is a client component; we re-create the same
 * Fuse instance shape here so the search keys + threshold stay locked.
 */
import Fuse from 'fuse.js';
import { describe, expect, it } from 'vitest';
import { coaRecords, type CoaRecord } from '@/lib/content/coa';

const fuse = new Fuse<CoaRecord>(coaRecords, {
  keys: ['peptideName', 'batch', 'lab'],
  threshold: 0.3,
  ignoreLocation: true,
});

describe('COA search (Fuse)', () => {
  it('finds a record by peptide short name', () => {
    const hits = fuse.search('BPC-157').map((r) => r.item.peptide);
    expect(hits).toContain('bpc-157-10mg');
  });

  it('finds records by batch substring', () => {
    const hits = fuse.search('BATCH-2026');
    expect(hits.length).toBe(coaRecords.length);
  });

  it('finds records by laboratory name', () => {
    const hits = fuse.search('Janoshik');
    expect(hits.length).toBe(coaRecords.length);
  });

  it('returns no matches for irrelevant query', () => {
    const hits = fuse.search('nonsense-token-xyz');
    expect(hits).toHaveLength(0);
  });
});
