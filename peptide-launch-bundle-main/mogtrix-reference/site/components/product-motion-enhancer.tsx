"use client";

import { useEffect } from "react";

export function ProductMotionEnhancer() {
  useEffect(() => {
    const reduceMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (reduceMotion?.matches) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const spinTimeouts = new Set<number>();

    import("motion/mini").then(({ animate }) => {
      if (cancelled) return;

      const cards = Array.from(
        document.querySelectorAll<HTMLElement>("[data-product-card]")
      );
      const showcaseCards = Array.from(
        document.querySelectorAll<HTMLElement>("[data-showcase-card]")
      );
      const vial = document.querySelector<HTMLElement>("[data-vial-float]");
      const glow = document.querySelector<HTMLElement>("[data-glow-pulse]");

      const spinVial = (vial: HTMLElement) => {
        if (vial.dataset.spinState === "running") return;
        vial.dataset.spinState = "running";

        animate(
          vial,
          {
            transform: [
              "rotateY(0deg) rotateZ(-2deg) scale(1)",
              "rotateY(-34deg) rotateZ(1deg) scale(1.045)",
              "rotateY(24deg) rotateZ(-1deg) scale(1.025)",
              "rotateY(-8deg) rotateZ(-2deg) scale(1.01)",
              "rotateY(0deg) rotateZ(-2deg) scale(1)"
            ]
          },
          {
            duration: 0.88,
            ease: [0.16, 1, 0.3, 1]
          }
        );

        const timeout = window.setTimeout(() => {
          vial.dataset.spinState = "";
          vial.style.transform = "rotateY(0deg) rotateZ(-2deg) scale(1)";
          spinTimeouts.delete(timeout);
        }, 930);
        spinTimeouts.add(timeout);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const card = entry.target as HTMLElement;
            const index = Number(card.dataset.productIndex ?? 0);

            animate(
              card,
              {
                opacity: [0, 1],
                transform: [
                  "translateY(28px) scale(0.98)",
                  "translateY(0) scale(1)"
                ]
              },
              {
                duration: 0.55,
                delay: Math.min(index * 0.055, 0.28),
                ease: [0.22, 1, 0.36, 1]
              }
            );
            observer.unobserve(card);
          }
        },
        { threshold: 0.24 }
      );

      for (const card of cards) {
        const vial = card.querySelector<HTMLElement>("[data-spin-vial]");
        card.style.opacity = "0";
        card.style.transform = "translateY(28px) scale(0.98)";
        observer.observe(card);

        const onEnter = () => {
          animate(
            card,
            { transform: "translateY(-6px) scale(1.012)" },
            { duration: 0.22 }
          );
          if (vial) spinVial(vial);
        };
        const onLeave = () => {
          animate(
            card,
            { transform: "translateY(0) scale(1)" },
            { duration: 0.22 }
          );
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerdown", onEnter);
        card.addEventListener("focusin", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerdown", onEnter);
          card.removeEventListener("focusin", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      }

      const standaloneVials = Array.from(
        document.querySelectorAll<HTMLElement>("[data-spin-vial]")
      ).filter((vial) => !vial.closest("[data-product-card]"));

      for (const vial of standaloneVials) {
        const onEnter = () => spinVial(vial);
        vial.addEventListener("pointerenter", onEnter);
        vial.addEventListener("pointerdown", onEnter);
        vial.addEventListener("focusin", onEnter);
        cleanups.push(() => {
          vial.removeEventListener("pointerenter", onEnter);
          vial.removeEventListener("pointerdown", onEnter);
          vial.removeEventListener("focusin", onEnter);
        });
      }

      for (const card of showcaseCards) {
        const index = Number(card.dataset.showcaseIndex ?? 0);
        card.style.opacity = "0";
        card.style.transform = "translateY(18px)";

        animate(
          card,
          {
            opacity: [0, 1],
            transform: ["translateY(18px)", "translateY(0)"]
          },
          {
            duration: 0.48,
            delay: index * 0.12,
            ease: "easeOut"
          }
        );

        const onEnter = () => {
          animate(
            card,
            { transform: "translateY(-6px) rotateX(2deg) rotateY(-3deg)" },
            { duration: 0.22 }
          );
        };
        const onLeave = () => {
          animate(
            card,
            { transform: "translateY(0) rotateX(0) rotateY(0)" },
            { duration: 0.22 }
          );
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      }

      if (vial) {
        const controls = animate(
          vial,
          { transform: ["translateY(0)", "translateY(-18px)", "translateY(0)"] },
          { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
        );
        cleanups.push(() => controls.stop());
      }

      if (glow) {
        const controls = animate(
          glow,
          {
            opacity: [0.26, 0.54, 0.26],
            transform: ["scale(0.94)", "scale(1.08)", "scale(0.94)"]
          },
          { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
        );
        cleanups.push(() => controls.stop());
      }

      cleanups.push(() => observer.disconnect());
    });

    return () => {
      cancelled = true;
      for (const timeout of spinTimeouts) window.clearTimeout(timeout);
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
