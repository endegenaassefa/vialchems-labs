"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DnaHelixScene() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    let cleanup = () => {};

    async function start() {
      const host = hostRef.current;
      if (!host) return;

      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      host.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const isMobile = window.innerWidth < 640;
      const pointCount = isMobile ? 112 : 176;
      const turns = 4.8;
      const radius = 1.28;
      const height = 7.7;
      const strandA: number[] = [];
      const strandB: number[] = [];
      const barSegments: number[] = [];

      for (let i = 0; i < pointCount; i += 1) {
        const t = i / (pointCount - 1);
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * height;
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        strandA.push(x1, y, z1);
        strandB.push(x2, y, z2);

        if (i % 8 === 0) {
          barSegments.push(x1, y, z1, x2, y, z2);
        }
      }

      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([...strandA, ...strandB], 3),
      );

      const pointMaterial = new THREE.PointsMaterial({
        color: 0x74c0fc,
        size: isMobile ? 0.045 : 0.04,
        transparent: true,
        opacity: 0.46,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Points(pointGeometry, pointMaterial));

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4dabf7,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const makeLine = (points: number[]) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(points, 3),
        );
        return new THREE.Line(geometry, lineMaterial);
      };

      group.add(makeLine(strandA));
      group.add(makeLine(strandB));

      const barsGeometry = new THREE.BufferGeometry();
      barsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(barSegments, 3),
      );
      group.add(new THREE.LineSegments(barsGeometry, lineMaterial));

      function resize() {
        if (!hostRef.current) return;
        const rect = hostRef.current.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      }

      resize();
      window.addEventListener("resize", resize);

      const reduceMotion = prefersReducedMotion();
      let previous = performance.now();

      function animate(now: number) {
        if (disposed) return;
        const delta = Math.min(now - previous, 50) / 1000;
        previous = now;

        if (!reduceMotion) {
          group.rotation.y += delta * ((Math.PI * 2) / 40);
          group.rotation.x = Math.sin(now / 9000) * 0.06;
        }

        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      }

      frame = window.requestAnimationFrame(animate);

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        pointGeometry.dispose();
        pointMaterial.dispose();
        lineMaterial.dispose();
        barsGeometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    start();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[70vh] w-[70vh] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] max-sm:h-[50vh] max-sm:w-[50vh]"
    />
  );
}
