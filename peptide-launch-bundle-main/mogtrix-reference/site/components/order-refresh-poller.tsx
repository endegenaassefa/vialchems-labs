"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrderRefreshPoller({
  active
}: {
  active: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!active) {
      return;
    }

    let refreshes = 0;
    const interval = window.setInterval(() => {
      refreshes += 1;
      router.refresh();

      if (refreshes >= 5) {
        window.clearInterval(interval);
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [active, router]);

  return null;
}
