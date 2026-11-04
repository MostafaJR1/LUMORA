"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent, type ConsentState } from "../lib/consent";
import { FB_PIXEL_ID, fbq } from "../lib/fpixel";

export default function FacebookPixel() {
  const [allowed, setAllowed] = useState(false);
  const pathname = usePathname();
  const initialized = useRef(false);
  const lastPath = useRef<string | null>(null);

  // 1. Read consent and listen for changes
  useEffect(() => {
    const update = (event?: Event) => {
      const detail =
        event instanceof CustomEvent
          ? (event.detail as ConsentState | undefined)
          : undefined;
      const choice = detail?.choice ?? getConsent()?.choice;
      setAllowed(choice === "granted");
      if (choice === "denied") fbq("consent", "revoke");
    };

    update();
    window.addEventListener(CONSENT_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CONSENT_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // 2. Init once, only after consent
  useEffect(() => {
    if (!allowed || !FB_PIXEL_ID || initialized.current) return;
    initialized.current = true;
    fbq("init", FB_PIXEL_ID);
    fbq("consent", "grant");
  }, [allowed]);

  // 3. One PageView per path (first load + every route change)
  useEffect(() => {
    if (!allowed || !FB_PIXEL_ID || !initialized.current) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    fbq("track", "PageView");
  }, [allowed, pathname]);

  if (!FB_PIXEL_ID || !allowed) return null;

  return (
    <Script
      id="facebook-pixel-base"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
      }}
    />
  );
}