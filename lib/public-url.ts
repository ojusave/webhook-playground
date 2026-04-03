/**
 * Public base URL for webhook links. Intended for Render only.
 * - NEXT_PUBLIC_APP_URL — optional override (e.g. custom domain in the dashboard)
 * - RENDER_EXTERNAL_URL — set automatically on Render web services
 * If neither is set, webhook URLs fall back to a path (`/api/hooks/...`).
 */

export function publicOrigin(): string {
  const custom = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim();
  if (custom) return custom;
  return process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "").trim() || "";
}

export function webhookUrlForEndpoint(id: string): string {
  const base = publicOrigin();
  if (!base) return `/api/hooks/${id}`;
  return `${base}/api/hooks/${id}`;
}
