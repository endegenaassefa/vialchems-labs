import Image from "next/image";

import {
  getProductVialVisual,
  type ProductPreview
} from "@/lib/content/products";

type ProductVialVisualProps = {
  product: Pick<ProductPreview, "slug" | "name">;
  priority?: boolean;
};

export function ProductVialVisual({
  product,
  priority = false
}: ProductVialVisualProps) {
  return (
    <div
      className="relative flex aspect-[4/5] items-end justify-center overflow-hidden px-4 pt-5 sm:px-6"
      data-card-vial
      role="img"
      aria-label={`${product.name} visual`}
    >
      <div className="absolute inset-x-[12%] bottom-3 h-20 rounded-full bg-[radial-gradient(circle,_rgba(124,255,0,0.22),_rgba(124,255,0,0)_72%)] blur-2xl" />
      <Image
        className="relative z-10 h-full w-auto max-w-[82%] object-contain drop-shadow-[0_26px_50px_rgba(0,0,0,0.58)]"
        src={getProductVialVisual(product)}
        alt=""
        width={1200}
        height={1600}
        priority={priority}
        unoptimized
        sizes="(max-width: 620px) 142px, 180px"
      />
    </div>
  );
}
