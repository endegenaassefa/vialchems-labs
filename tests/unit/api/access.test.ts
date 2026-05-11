import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// Mock supabase before importing the route.
const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));
const supabaseClient = { from: fromMock };

vi.mock('@/lib/supabase', () => ({
  serviceSupabase: () => null, // Day-1 default: REQUIRE_SUPABASE=false → null
  _resetSupabaseCachesForTests: () => {},
}));

import { POST } from '@/app/api/access/route';

const validPayload = {
  email: 'researcher@example.com',
  role: 'academic-researcher',
  researchPurpose:
    'Investigating in-vitro fibroblast migration kinetics in cell-culture wound-closure assays per laboratory protocol.',
  ageAcknowledgment: true,
  ruoAcknowledgment: true,
  jurisdictionAcknowledgment: true,
  attestationsAcknowledged: true,
};

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/access', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/access (D7 qualification persistence)', () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
    insertMock.mockResolvedValue({ error: null });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 200 with ok:true on a valid submission (Supabase off → no-op write)', async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.id).toBe('string');
  });

  it('returns 400 on invalid payload (missing required field)', async () => {
    const bad = { ...validPayload, email: 'not-an-email' };
    const res = await POST(makeRequest(bad));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it('returns 400 when researchPurpose contains forbidden marketing copy', async () => {
    const bad = {
      ...validPayload,
      researchPurpose:
        'I want to use this for weight loss and to treat my muscle pain.',
    };
    const res = await POST(makeRequest(bad));
    expect(res.status).toBe(400);
  });

  it('rejects non-JSON request bodies', async () => {
    const req = new Request('http://localhost/api/access', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
