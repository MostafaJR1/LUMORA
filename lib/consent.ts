export const CONSENT_STORAGE_KEY = "lumora_consent_v1";
export const CONSENT_EVENT = "lumora:consent-change";
export const CONSENT_REOPEN_EVENT = "lumora:reopen-consent";

export type ConsentChoice = "granted" | "denied";

export type ConsentState = {
  choice: ConsentChoice;
  timestamp: string;
};

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.choice !== "granted" && parsed.choice !== "denied") return null;
    return {
      choice: parsed.choice,
      timestamp: typeof parsed.timestamp === "string" ? parsed.timestamp : "",
    };
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  const state: ConsentState = { choice, timestamp: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Consent can remain effective for this page if storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function resetConsentChoice() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // The reopen event still works if browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, {
    detail: { choice: "denied", timestamp: "" },
  }));
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT));
  window.fbq?.("consent", "revoke");
}

export function hasMarketingConsent() {
  return getConsent()?.choice === "granted";
}
