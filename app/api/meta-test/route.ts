// DEV-ONLY: sends a test Lead to Meta. Returns 404 in production. Delete this file before launch.

import { createHash, randomUUID } from "node:crypto";
import { connection } from "next/server";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  await connection();

  const invalidVariables: string[] = [];
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  const graphVersion = process.env.META_GRAPH_VERSION?.trim() || "v23.0";

  if (!pixelId || !/^[0-9]+$/.test(pixelId)) {
    invalidVariables.push("NEXT_PUBLIC_FB_PIXEL_ID");
  }
  if (!accessToken) invalidVariables.push("META_CAPI_ACCESS_TOKEN");
  if (!testEventCode) invalidVariables.push("META_TEST_EVENT_CODE");

  if (invalidVariables.length > 0) {
    return Response.json(
      { ok: false, error: "missing_or_invalid_environment", variables: invalidVariables },
      { status: 501 },
    );
  }

  const eventId = `test-${randomUUID()}`;
  const origin = new URL(request.url).origin;
  const sha256 = (value: string) =>
    createHash("sha256").update(value).digest("hex");

  const userData: Record<string, string | string[]> = {
    ph: [sha256("212600000000")],
    country: [sha256("ma")],
  };
  const userAgent = request.headers.get("user-agent");
  if (userAgent) userData.client_user_agent = userAgent;

  const payload = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: "website",
      event_source_url: `${origin}/`,
      user_data: userData,
      custom_data: {
        value: 149,
        currency: "MAD",
        content_name: "LUMORA CAPI test",
      },
    }],
    access_token: accessToken,
    test_event_code: testEventCode,
  };

  let response: globalThis.Response;
  try {
    response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch {
    return Response.json({ ok: false, error: "network_error" }, { status: 502 });
  }

  const result = await response.json().catch(() => null) as {
    events_received?: number;
    fbtrace_id?: string;
    messages?: unknown;
    error?: {
      message?: unknown;
      type?: unknown;
      code?: unknown;
      error_subcode?: unknown;
    };
  } | null;

  const metaError = result?.error
    ? {
        message: typeof result.error.message === "string" ? result.error.message : null,
        type: typeof result.error.type === "string" ? result.error.type : null,
        code: typeof result.error.code === "number" ? result.error.code : null,
        error_subcode:
          typeof result.error.error_subcode === "number"
            ? result.error.error_subcode
            : null,
      }
    : undefined;

  return Response.json({
    ok: response.ok,
    httpStatus: response.status,
    eventId,
    sentTestCode: true,
    events_received: typeof result?.events_received === "number"
      ? result.events_received
      : null,
    fbtrace_id: typeof result?.fbtrace_id === "string"
      ? result.fbtrace_id
      : null,
    messages: Array.isArray(result?.messages) ? result.messages : [],
    ...(metaError ? { metaError } : {}),
  }, { status: response.ok ? 200 : response.status });
}
