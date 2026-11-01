"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent, setConsent } from "../lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const openSettings = () => setVisible(true);
    const consentChanged = () => setVisible(false);
    window.addEventListener("lumora:open-consent", openSettings);
    window.addEventListener(CONSENT_EVENT, consentChanged);
    queueMicrotask(() => setVisible(getConsent() === null));
    return () => {
      window.removeEventListener("lumora:open-consent", openSettings);
      window.removeEventListener(CONSENT_EVENT, consentChanged);
    };
  }, []);

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="إعدادات الخصوصية"
      dir="rtl"
      className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-5xl border border-white/10 bg-forest-950 px-5 py-4 text-cream shadow-2xl sm:bottom-4 sm:rounded-xl sm:px-6 motion-reduce:transition-none"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-cream/90">
          نستخدم ملفات تعريف الارتباط لتحسين التجربة وقياس الحملات الإعلانية.
        </p>
        <div className="flex gap-2 sm:flex-none">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="min-h-11 flex-1 rounded-xl border border-gold-400 px-4 text-sm font-semibold text-gold-300 sm:flex-none"
          >
            رفض الإعلانات
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="min-h-11 flex-1 rounded-xl bg-gold-400 px-4 text-sm font-bold text-forest-950 sm:flex-none"
          >
            الموافقة
          </button>
        </div>
      </div>
    </aside>
  );
}
