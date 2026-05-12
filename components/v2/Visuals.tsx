'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CatalogItem } from './data';

export function MoleculeBg() {
  const { nodes, edges } = useMemo(() => {
    const seed = 7;
    const rand = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    const ns = Array.from({ length: 32 }, (_, i) => ({
      x: rand(seed + i * 1.7) * 1400,
      y: rand(seed + i * 2.3) * 700,
      r: 1.5 + rand(i * 0.7) * 1.5,
    }));
    const es: { a: number; b: number; d: number }[] = [];
    for (let i = 0; i < ns.length; i += 1) {
      for (let j = i + 1; j < ns.length; j += 1) {
        const dx = ns[i].x - ns[j].x;
        const dy = ns[i].y - ns[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) es.push({ a: i, b: j, d });
      }
    }
    return { nodes: ns, edges: es };
  }, []);

  return (
    <svg className="molecule-bg" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="v2-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.10" />
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1400" height="700" fill="url(#v2-fade)" />
      {edges.map((edge, i) => (
        <line
          key={i}
          x1={nodes[edge.a].x}
          y1={nodes[edge.a].y}
          x2={nodes[edge.b].x}
          y2={nodes[edge.b].y}
          stroke="var(--line-strong)"
          strokeWidth="0.5"
          opacity={1 - edge.d / 160}
        />
      ))}
      {nodes.map((node, i) => (
        <circle key={i} cx={node.x} cy={node.y} r={node.r} fill="var(--accent-hi)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => setShown(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal${shown ? ' in' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export function ProductVisual({ item, small = false }: { item: Pick<CatalogItem, 'image' | 'shortName'>; small?: boolean }) {
  return (
    <div className={`product-shot${small ? ' product-shot-sm' : ''}`}>
      <img src={item.image} alt={`${item.shortName} vial`} loading="lazy" />
    </div>
  );
}

export function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-subtle)', marginBottom: 2 }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          fontWeight: 500,
          color: highlight ? 'var(--ok)' : 'var(--fg)',
          transition: 'color 400ms var(--ease)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
