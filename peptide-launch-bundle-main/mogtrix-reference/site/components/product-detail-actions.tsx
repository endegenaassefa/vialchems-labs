"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/button";
import { useCartStore } from "@/lib/cart-store";

export function ProductDetailActions({ productId }: { productId: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={() => {
          addItem(productId);
          setAdded(true);
        }}
      >
        <ShoppingBag size={18} /> Add to cart
      </Button>
      <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]" href="/cart">
        Open cart
      </Link>
      {added ? <p className="self-center text-sm text-[var(--accent)]">Added to cart.</p> : null}
    </div>
  );
}
