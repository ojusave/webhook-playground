/**
 * Public URL for links and webhooks. Order:
 * 1. NEXT_PUBLIC_APP_URL — optional override (custom domain, bad proxy headers)
 * 2. Request headers — Host + X-Forwarded-* (works on Render after deploy without env)
 * 3. Empty → callers fall back to a path-only URL
 */

type HeaderBag = { get(name: string): string | null };

export function resolvePublicOrigin(h?: HeaderBag): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim();
  if (explicit) return explicit;

  if (!h) return "";

  const hostRaw =
    h.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    h.get("host")?.split(",")[0]?.trim() ||
    "";
  if (!hostRaw) return "";

  const forwardedProto = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isLocal =
    hostRaw.startsWith("localhost:") ||
    hostRaw.startsWith("127.0.0.1:") ||
    hostRaw === "localhost" ||
    hostRaw.startsWith("[::1]");
  const proto =
    forwardedProto || (isLocal ? "http" : "https");

  return `${proto}://${hostRaw}`;
}

export function webhookUrlForEndpoint(id: string, h?: HeaderBag): string {
  const base = resolvePublicOrigin(h);
  if (!base) return `/api/hooks/${id}`;
  return `${base}/api/hooks/${id}`;
}
