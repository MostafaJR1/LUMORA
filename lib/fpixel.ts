import { PRODUCTS } from "../app/products";
import { hasMarketingConsent } from "./consent";

const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();
export const FB_PIXEL_ID =
  pixelId && /^\d+$/.test(pixelId) ? pixelId : undefined;

export type Fbq = (
  command: "init" | "track" | "trackCustom" | "consent",
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) return;
  (window.fbq as (...values: unknown[]) => void)(...args);
}

export function createEventId(prefix = "lumora") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getProductTrackingData() {
  const product = PRODUCTS[0];
  if (!product) {
    return {
      currency: "MAD",
      content_ids: [],
      content_type: "product",
      content_name: "",
    };
  }
  return {
    value: product.price,
    currency: "MAD",
    content_ids: [product.id],
    content_type: "product",
    content_name: product.name,
  };
}

export function trackViewContent(payload: Record<string, unknown>, eventId = createEventId("view")) {
  if (!hasMarketingConsent()) return eventId;
  fbq("track", "ViewContent", payload, { eventID: eventId });
  return eventId;
}

export function trackInitiateCheckout(payload: Record<string, unknown>, eventId = createEventId("checkout")) {
  if (!hasMarketingConsent()) return eventId;
  fbq("track", "InitiateCheckout", payload, { eventID: eventId });
  return eventId;
}

// Call only after /api/leads succeeded, and pass the SAME eventId that was
// sent to the API, otherwise Meta cannot deduplicate browser and server.
export function trackLead(payload: Record<string, unknown>, eventId = createEventId("lead")) {
  if (!hasMarketingConsent()) return eventId;
  if (payload.ok) {
    fbq("track", "Lead", getProductTrackingData(), { eventID: eventId });
  }
  return eventId;
}