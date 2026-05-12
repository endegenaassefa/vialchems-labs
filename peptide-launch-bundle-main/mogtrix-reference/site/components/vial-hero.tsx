"use client";

import Image from "next/image";

export function VialHero() {
  return (
    <div className="relative mx-auto flex min-h-[380px] w-full max-w-[620px] items-center justify-center overflow-hidden px-4 py-8 md:min-h-[560px]">
      <div className="absolute inset-x-[10%] bottom-12 h-12 rounded-full bg-[rgba(0,0,0,0.6)] blur-2xl" data-testid="vial-shadow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(124,255,0,0.12),transparent_34%),radial-gradient(circle_at_24%_24%,rgba(255,176,79,0.12),transparent_22%)]" />
      <div className="vial-float relative w-full max-w-[460px]">
        <div className="vial-tilt relative">
          <div className="pointer-events-none absolute inset-[8%] z-20 overflow-hidden rounded-[32px]" data-testid="vial-highlight">
            <div className="vial-sheen absolute inset-y-[-12%] left-[-30%] w-[28%] rotate-[12deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)] blur-md" />
          </div>
          <Image
            src="/vials/realistic-vial.png"
            alt="Mogtrix vial"
            width={1200}
            height={1600}
            priority
            sizes="(min-width: 1024px) 460px, (min-width: 768px) 420px, 82vw"
            className="relative z-10 mx-auto block h-auto w-full max-h-[540px] object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.45)] md:max-h-[580px]"
          />
        </div>
      </div>
    </div>
  );
}
