"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent, type ConsentState } from "../lib/consent";
import { FB_PIXEL_ID, fbq } from "../lib/fpixel";

export default function FacebookPixel() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = (event?: Event) => {
      const detail = event instanceof CustomEvent
        ? event.detail as ConsentState | undefined
        : undefined;
      const consent = detail?.choice ?? getConsent()?.choice;
      setAllowed(consent === "granted");
      if (consent === "denied") {
        fbq("consent", "revoke");
      }
    };

    update();
    window.addEventListener(CONSENT_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CONSENT_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (!allowed || !FB_PIXEL_ID) return;
    fbq("init", FB_PIXEL_ID);
    fbq("consent", "grant");
    fbq("track", "PageView");
  }, [allowed]);

  useEffect(() => {
    const consent = getConsent();
    if (consent?.choice === "denied") {
      fbq("consent", "revoke");
    }
  }, []);

  if (!FB_PIXEL_ID || !allowed) return null;

  return (
    <>
      <Script
        id="facebook-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
        }}
      />
    </>
  );
}
