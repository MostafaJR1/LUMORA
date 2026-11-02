import "server-only";
import { createHash } from "node:crypto";
import { PRODUCTS } from "../app/products";

type MetaLeadParams = {
  eventId: string;
  name: string;
  phone: string;
  eventSourceUrl: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
};

function normalizedHash(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}

export async function sendMetaLead(params: MetaLeadParams) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const { first, last } = splitName(params.name);
  const phoneDigits = params.phone.replace(/\D/g, "");
  const phone = phoneDigits.startsWith("212")
    ? `212${phoneDigits.slice(3)}`
    : `212${phoneDigits.replace(/^0/, "")}`;
  const testEventCode = process.env.META_TEST_EVENT_CODE;
  const graphVersion = process.env.META_GRAPH_VERSION || "v23.0";
  const product = PRODUCTS[0];

  const userData: Record<string, string | string[]> = {
    ph: [normalizedHash(phone)],
    country: [normalizedHash("ma")],
  };
  if (first) userData.fn = [normalizedHash(first)];
  if (last) userData.ln = [normalizedHash(last)];
  if (params.clientIp) userData.client_ip_address = params.clientIp;
  if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent;
  if (params.fbp) userData.fbp = params.fbp;
  if (params.fbc) userData.fbc = params.fbc;

  const payload: Record<string, unknown> = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: params.eventSourceUrl,
      event_id: params.eventId,
      user_data: userData,
      custom_data: {
        value: product.price,
        currency: "MAD",
        content_ids: [product.id],
        content_type: "product",
        content_name: product.name,
      },
    }],
    access_token: accessToken,
  };
  if (testEventCode) payload.test_event_code = testEventCode;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      },
    );
    console.log(response.status);
  } catch {
    // Network and timeout failures are intentionally not logged with request details.
  }
}
