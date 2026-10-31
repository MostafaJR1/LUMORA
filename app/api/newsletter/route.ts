// Place this file at: app/api/newsletter/route.ts
// Add to .env.local:  BREVO_API_KEY=...   BREVO_LIST_ID=<number of your Brevo list>
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    // Not configured yet: the form will show its error message instead of pretending to succeed
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}