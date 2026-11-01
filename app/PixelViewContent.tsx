"use client";

import { useEffect, useRef } from "react";
import { hasMarketingConsent } from "../lib/consent";
import { trackViewContent } from "../lib/fpixel";
import { PRODUCTS } from "./products";

export default function PixelViewContent() {
  const tracked = useRef(false);

  useEffect(() => {
    const product = document.getElementById("product");
    if (!product) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || tracked.current || !hasMarketingConsent()) return;
      tracked.current = true;
      const item = PRODUCTS[0];
      trackViewContent({
        content_name: item?.name ?? "LUMORA product",
        content_ids: item ? [item.id] : [],
        content_type: "product",
        value: item?.price ?? 149,
        currency: "MAD",
      });
    }, { threshold: 0.25 });

    observer.observe(product);
    return () => observer.disconnect();
  }, []);

  return null;
}
