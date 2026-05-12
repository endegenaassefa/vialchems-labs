import Image from "next/image";
import type { Product } from "@/lib/content/products";
import { getProductStudioImage } from "@/lib/content/product-images";
import { cn } from "@/lib/utils";
import { VialProductPhoto } from "./VialProductPhoto";

export interface ProductStudioVisualProps {
  product: Product;
  batch?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

/**
 * Shared product-media surface.
 *
 * Uses the merged site's photoreal product-shot style where a SKU image is
 * available. The image set is label-matched per slug; the black studio vial is
 * only a defensive fallback.
 */
export function ProductStudioVisual({
  product,
  batch = "2026-01",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
  imageClassName,
  fallbackClassName,
}: ProductStudioVisualProps) {
  const studioImage = getProductStudioImage(product.slug);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-black",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.14),transparent_46%)]",
        className,
      )}
    >
      {studioImage ? (
        <Image
          src={studioImage.src}
          alt={studioImage.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "relative z-10 object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/product:scale-[1.035] group-hover/product:-translate-y-0.5 group-hover/product:saturate-[1.08] group-hover/product:contrast-[1.06]",
            imageClassName,
          )}
        />
      ) : (
        <VialProductPhoto
          compound={product.shortName}
          dose={product.dose}
          batch={batch}
          className={cn(
            "absolute inset-0 z-10 h-full min-h-0",
            fallbackClassName,
          )}
        />
      )}
    </div>
  );
}
