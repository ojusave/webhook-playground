/**
 * Managed Postgres (e.g. Render) requires TLS. Node `pg` often needs
 * `rejectUnauthorized: false` for these providers (see Render Postgres docs).
 *
 * - Any host that is not localhost / 127.0.0.1 / ::1 uses TLS (covers internal
 *   Render hostnames that do not contain "render.com").
 * - DATABASE_SSL_DISABLE=1 — force no SSL (plain local Postgres on a LAN host).
 * - DATABASE_SSL_NO_VERIFY=1 — same as default remote behavior (escape hatch).
 */
function getPgSsl() {
  const url = process.env.DATABASE_URL || "";
  if (!url) return undefined;
  if (process.env.DATABASE_SSL_DISABLE === "1") {
    return undefined;
  }
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1";
    if (isLocal) return undefined;
  } catch {
    /* malformed URL — fall through to safe remote default */
  }
  return { rejectUnauthorized: false };
}

module.exports = { getPgSsl };
