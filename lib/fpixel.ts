export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export type Fbq = (
  command: "init" | "track" | "trackCustom",
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

export function trackViewContent(payload: Record<string, unknown>, eventId = createEventId("view")) {
  fbq("track", "ViewContent", payload, { eventID: eventId });
  return eventId;
}

export function trackInitiateCheckout(payload: Record<string, unknown>, eventId = createEventId("checkout")) {
  fbq("track", "InitiateCheckout", payload, { eventID: eventId });
  return eventId;
}

export function trackLead(payload: Record<string, unknown>, eventId = createEventId("lead")) {
  fbq("track", "Lead", payload, { eventID: eventId });
  return eventId;
}
