import '@testing-library/jest-dom/vitest';

// jsdom doesn't ship IntersectionObserver, but motion's `whileInView` needs it
// (Phase 7 v4 — Motion & Interaction Layer). Stub it inertly so motion's
// in-view trigger doesn't crash; tests that need to verify scroll-trigger
// behavior should override per-test.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class StubIntersectionObserver implements IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds: ReadonlyArray<number> = [];
    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      void callback;
      void options;
    }
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver =
    StubIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom doesn't ship matchMedia either; stub returning a static "no" so
// useReducedMotion etc. don't blow up if a test forgets to mock it.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
