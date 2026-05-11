'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  opacity: number;
};

type Formula = {
  text: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  mono: boolean;
};

const FORMULAS = ['NH₂', 'OH', '—COOH', 'H₂N—', 'C₅H₁₁NO₂S', 'C₁₆H₂₈N₄O₆', 'CO—NH'];

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function ParticleFormulaField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;
    const ctx = context;
    const surface = canvas;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let formulas: Formula[] = [];
    const reduceMotion = prefersReducedMotion();
    const mouse = { x: 0, y: 0 };

    function makeParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: randomBetween(0.35, 1),
        size: randomBetween(1, 3),
        speed: randomBetween(4, 14),
        sway: randomBetween(6, 22),
        phase: randomBetween(0, Math.PI * 2),
        opacity: randomBetween(0.2, 0.7),
      };
    }

    function makeFormula(initial = false): Formula {
      return {
        text: FORMULAS[Math.floor(Math.random() * FORMULAS.length)] ?? 'NH₂',
        x: randomBetween(-40, width + 40),
        y: initial ? randomBetween(0, height) : height + randomBetween(20, 120),
        size: randomBetween(12, width < 640 ? 26 : 40),
        speed: randomBetween(2, 7),
        opacity: randomBetween(0.06, 0.1),
        mono: Math.random() > 0.45,
      };
    }

    function resize() {
      const rect = surface.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(width * dpr);
      surface.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = width < 640 ? 44 : 108;
      const formulaCount = width < 640 ? 8 : 14;
      particles = Array.from({ length: particleCount }, makeParticle);
      formulas = Array.from({ length: formulaCount }, () => makeFormula(true));
    }

    function draw(now: number) {
      ctx.clearRect(0, 0, width, height);
      const parallaxX = mouse.x * 15;
      const parallaxY = mouse.y * 8;

      for (const particle of particles) {
        if (!reduceMotion) {
          particle.y -= particle.speed / 60;
          if (particle.y < -16) {
            particle.y = height + 16;
            particle.x = Math.random() * width;
          }
        }

        const x =
          particle.x +
          Math.sin(now / 2400 + particle.phase) * particle.sway +
          parallaxX * particle.z;
        const y = particle.y + parallaxY * particle.z;
        const radius = particle.size * particle.z;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        glow.addColorStop(0, `rgba(116, 192, 252, ${particle.opacity})`);
        glow.addColorStop(1, 'rgba(116, 192, 252, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const formula of formulas) {
        if (!reduceMotion) {
          formula.y -= formula.speed / 60;
          if (formula.y < -60) Object.assign(formula, makeFormula(false));
        }

        ctx.save();
        ctx.globalAlpha = formula.opacity;
        ctx.fillStyle = '#74c0fc';
        ctx.font = `${formula.size}px ${
          formula.mono
            ? 'var(--font-mono), ui-monospace, monospace'
            : 'var(--font-sans), ui-sans-serif, system-ui'
        }`;
        ctx.translate(
          formula.x + parallaxX * 0.42,
          formula.y + parallaxY * 0.35,
        );
        ctx.rotate(Math.sin(now / 7000 + formula.x) * 0.12);
        ctx.fillText(formula.text, 0, 0);
        ctx.restore();
      }

      if (!reduceMotion) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    function onPointerMove(event: PointerEvent) {
      mouse.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      mouse.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}
