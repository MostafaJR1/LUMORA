"use client";

import { useEffect, useRef } from "react";
import { CONSENT_EVENT, hasMarketingConsent } from "../lib/consent";
import { getProductTrackingData, trackViewContent } from "../lib/fpixel";

export default function PixelViewContent() {
  const tracked = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const product = document.getElementById("product");
    if (!product) return;

    const trackIfReady = () => {
      if (!visible.current || tracked.current || !hasMarketingConsent()) return;
      tracked.current = true;
      trackViewContent({
        ...getProductTrackingData(),
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      trackIfReady();
    }, { threshold: 0.25 });

    observer.observe(product);
    window.addEventListener(CONSENT_EVENT, trackIfReady);
    return () => {
      observer.disconnect();
      window.removeEventListener(CONSENT_EVENT, trackIfReady);
    };
  }, []);

  return null;
}
