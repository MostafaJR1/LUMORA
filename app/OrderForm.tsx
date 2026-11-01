"use client";

import { useState, type FormEvent } from "react";
import { isValidName, normalizeName, normalizePhone } from "../lib/phone";
import { buttonStyles } from "./buttonStyles";

export default function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameError("");
    setPhoneError("");
    setSubmissionError("");

    const normalizedName = normalizeName(name);
    const normalizedPhone = normalizePhone(phone);
    let firstInvalid: HTMLInputElement | null = null;

    if (!isValidName(normalizedName)) {
      setNameError("أدخل اسمك الكامل");
      firstInvalid = document.getElementById("order-name") as HTMLInputElement | null;
    }

    if (!/^0[5-7][0-9]{8}$/.test(normalizedPhone)) {
      setPhoneError("أدخل رقم هاتف مغربي صحيح، مثال: 0612345678");
      if (!firstInvalid) {
        firstInvalid = document.getElementById("order-phone") as HTMLInputElement | null;
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedName, phone: normalizedPhone, website }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data || data.ok !== true) {
        if (data?.error === "invalid_name") {
          setNameError("أدخل اسمك الكامل");
          document.getElementById("order-name")?.focus();
          return;
        }
        if (data?.error === "invalid_phone") {
          setPhoneError("أدخل رقم هاتف مغربي صحيح، مثال: 0612345678");
          document.getElementById("order-phone")?.focus();
          return;
        }
        throw new Error();
      }
      setSuccess(true);
    } catch {
      setSubmissionError("تعذّر إرسال طلبك. حاول مرة أخرى بعد قليل.");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    const firstName = normalizeName(name).split(" ")[0];
    return (
      <p role="status" className="mx-auto max-w-md text-base font-semibold leading-relaxed text-cream motion-reduce:transition-none">
        شكرًا لك {firstName}! تم استلام طلبك، وسنتصل بك قريبًا لتأكيده.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-md" dir="rtl">
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="order-name" className="sr-only">الاسم الكامل</label>
          <input
            id="order-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="الاسم الكامل"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError("");
            }}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "order-name-error" : undefined}
            className="h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-base text-forest-900 placeholder:text-forest-900/45 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:text-base"
          />
          {nameError && (
            <p id="order-name-error" aria-live="polite" className="mt-2 text-sm text-gold-200">
              {nameError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="order-phone" className="sr-only">رقم الهاتف</label>
          <input
            id="order-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            required
            maxLength={16}
            placeholder="06 12 34 56 78"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              if (phoneError) setPhoneError("");
            }}
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? "order-phone-error" : undefined}
            className="h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-base text-forest-900 placeholder:text-forest-900/45 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:text-base"
          />
          {phoneError && (
            <p id="order-phone-error" aria-live="polite" className="mt-2 text-sm text-gold-200">
              {phoneError}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={sending}
          className={buttonStyles({ variant: "gold", size: "lg", className: "w-full flex-none" })}
        >
          {sending ? "جارٍ الإرسال…" : "اطلب الآن"}
        </button>
      </div>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
      />
      {submissionError && (
        <p aria-live="polite" className="mt-2 text-sm text-gold-200">
          {submissionError}
        </p>
      )}
    </form>
  );
}
