"use client";

import { useEffect, useRef } from "react";
import { hasMarketingConsent } from "../lib/consent";
import { getProductTrackingData, trackViewContent } from "../lib/fpixel";

export default function PixelViewContent() {
  const tracked = useRef(false);

  useEffect(() => {
    const product = document.getElementById("product");
    if (!product) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || tracked.current || !hasMarketingConsent()) return;
      tracked.current = true;
      trackViewContent({
        ...getProductTrackingData(),
      });
    }, { threshold: 0.25 });

    observer.observe(product);
    return () => observer.disconnect();
  }, []);

  return null;
}
